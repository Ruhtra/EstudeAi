"use client";

import { useState, useEffect, useTransition, useActionState, useId, use } from "react";
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
import { useServerAction } from "zsa-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userSchema, UserFormData } from "../lib/schema";
import { createUser, updateUser, getUser } from "../actions";

interface UserDialogProps {
  userId?: string;
  trigger: React.ReactNode;
}

export default function UserDialog({ userId, trigger }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const { isPending, execute, data, error } = useServerAction(createUser)
  let [isLoadingUser, startTransition] = useTransition();

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
    const fetchUser = async () => {
      if (userId && open) startTransition(async () => {
        const user = await getUser(userId);
        form.reset({
          birthDate: user?.birthDate.toISOString().split("T")[0],
          email: user?.email,
          id: user?.id,
          name: user?.name,
          password: "", // Não preenche a senha para edição
        });
      });
    };

    fetchUser();
  }, [userId, open, form]);


  const onSubmit = async (data: UserFormData) => {
    const [datas, erro] = await execute(data)

    
    console.log('aaaaqui');
    console.log(datas);
    console.log(erro);
    if (erro) {
      return 
    }
    
    
    form.reset();
    setOpen(false);
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
            <p>Loading...</p>
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
              <Button type="submit" disabled={isLoadingUser || isPending}>
                { isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
