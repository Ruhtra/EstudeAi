"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userSchema, UserFormData } from "../lib/schema";
import { createUser, updateUser } from "../actions";
import { useUser } from "../hooks/useUsers";

interface UserDialogProps {
  userId?: string;
  trigger: React.ReactNode;
}

export default function UserDialog({ userId, trigger }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser(userId || "");

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      birthDate: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate.toString().split("T")[0],
        password: "", // Don't populate password for editing
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      if (userId) {
        await updateUser(userId, data);
      } else {
        await createUser(data);
      }
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userId ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        {isLoadingUser ? (
          <div className="flex justify-center items-center h-40">
            <p>loading...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {userId ? "New Password (optional)" : "Password"}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isLoadingUser}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
