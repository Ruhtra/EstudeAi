"use client";
import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { formSchema } from "../_actions/user.schema";
import { UserRole } from "@prisma/client";
import { createUser, updateuser, type UserDTO } from "../_actions/user";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";
import { useQuery } from "@tanstack/react-query";
import { ImageUploadField } from "./image-upload-field";
import { InputCpfField } from "./input-cpf-field";
import { InputPhoneField } from "./input-phone-field";
import { SkeletonUserDialog } from "./SkeletonUserDialog";

const estadosBrasileiros = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export type FormValues = z.infer<typeof formSchema>;

interface AddUserDialogProps {
  idUser?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  idUser,
  open,
  onOpenChange,
}: AddUserDialogProps) {
  const [userType, setUserType] = useState<UserRole>(UserRole.student);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", idUser],
    queryFn: () => fetchUser(idUser),
    enabled: !!idUser && open,
    refetchOnMount: true,
  });

  const defaultValues: Record<string, string> = {
    role: userData?.role || UserRole.student,
    email: userData?.email || "",
    phone: userData?.phone || "",
    city: userData?.city || "",
    firstName: userData?.name.split(" ")[0] || "",
    lastName: userData?.name.split(" ")[1] || "",
    fullName: userData?.name || "",
    cpf: userData?.cpf || "",
    state: userData?.state || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (userData) {
      Object.entries(userData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });

      form.setValue(
        "role",
        (userData.role.toLowerCase() as
          | "admin"
          | "teacher"
          | "student"
          | "sup") ?? "student"
      );
      form.setValue("email", userData.email ?? "");
      form.setValue("phone", userData.phone ?? "");
      form.setValue("city", userData.city ?? "");
      form.setValue("firstName", userData.name.split(" ")[0] ?? "");
      form.setValue("lastName", userData.name.split(" ")[1] ?? "");
      form.setValue("fullName", userData.name ?? "");
      form.setValue("cpf", userData.cpf ?? "");
      form.setValue("state", userData.state ?? "");

      setUserType(userData.role);
    }
  }, [userData, form]);

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (idUser) {
          const data = await updateuser(idUser, values);

          if (data.error) toast(data.error);
          if (data.success) {
            await queryClient.refetchQueries({
              queryKey: ["users"],
            });
            queryClient.removeQueries({
              queryKey: ["user", idUser],
            });

            onOpenChange(false);
            form.reset();
            toast("Usuário atualizado com sucesso");
          }
        } else {
          const data = await createUser(values);
          if (data.error) toast(data.error);
          if (data.success) {
            onOpenChange(false);
            form.reset();
            toast("Usuário criado com sucesso");
            // setPreviewUrl(null);
            await queryClient.refetchQueries({
              queryKey: ["users"],
            });
          }
        }
      } catch {
        toast("Algo deu errado, contate o suporte!");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {idUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do usuário abaixo.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <SkeletonUserDialog />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 mb-6 md:mb-0">
                    <ImageUploadField
                      form={form}
                      name="photo"
                      initialImageUrl={userData?.imageUrl || undefined}
                      isPending={isPending}
                      userType={userType}
                    />
                    <FormLabel className="text-center">
                      {userType === UserRole.student
                        ? "Foto (opcional)"
                        : "Foto"}
                    </FormLabel>
                  </div>
                  <div className="w-full md:w-2/3">
                    <Tabs
                      value={userType}
                      onValueChange={(value: string) => {
                        setUserType(UserRole[value as keyof typeof UserRole]);
                        form.setValue(
                          "role",
                          UserRole[value as keyof typeof UserRole]
                        );
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="admin">Colaborador</TabsTrigger>
                        <TabsTrigger value="sup">Suporte</TabsTrigger>
                        <TabsTrigger value="teacher">Professor</TabsTrigger>
                        <TabsTrigger value="student">Assinante</TabsTrigger>
                      </TabsList>
                      <TabsContent value="admin">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                  <Input disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <InputCpfField form={form} isPending={isPending} />
                        </div>
                      </TabsContent>
                      <TabsContent value="teacher">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                  <Input disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <InputCpfField form={form} isPending={isPending} />
                        </div>
                      </TabsContent>
                      <TabsContent value="sup">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                  <Input disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <InputCpfField form={form} isPending={isPending} />
                        </div>
                      </TabsContent>
                      <TabsContent value="student">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sobrenome</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem className="flex flex-col justify-between">
                                  <FormLabel>Estado</FormLabel>
                                  <Combobox
                                    disabled={isPending}
                                    options={estadosBrasileiros}
                                    value={field.value}
                                    onSetValue={field.onChange}
                                    placeholder="Digite para buscar..."
                                    emptyMessage="Nenhum estado encontrado."
                                    searchPlaceholder="Selecione um estado"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cidade</FormLabel>
                                  <FormControl>
                                    <Input disabled={isPending} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InputPhoneField form={form} isPending={isPending} />
                <Button
                  disabled={isPending || isLoading}
                  type="submit"
                  className="w-full"
                >
                  {isPending
                    ? idUser
                      ? "Atualizando Usuário"
                      : "Criando Usuário"
                    : idUser
                      ? "Atualizar Usuário"
                      : "Adicionar Usuário"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

async function fetchUser(id: string | undefined): Promise<UserDTO | null> {
  if (id) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  }
  return null;
}
