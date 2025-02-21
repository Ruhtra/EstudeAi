"use client";

import { useTransition, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { ImageUploadField } from "../users/_components/image-upload-field";
import { InputPhoneField } from "../users/_components/input-phone-field";
import { InputCpfField } from "../users/_components/input-cpf-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, User } from "lucide-react";
import { UserMeDTO } from "@/app/api/users/me/route";
import { profileSchema } from "./_actions/profile.schema";
import { queryClient } from "@/lib/queryCLient";
import { updateMe } from "./_actions/profile";
import { useSession } from "next-auth/react";

type FormValues = z.infer<typeof profileSchema>;

const estadosBrasileiros = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

function SkeletonProfile() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 flex flex-col items-center space-y-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition();
  const { data: userData, isPending: isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchCurrentUser,
    refetchOnMount: true,
  });

  const { update } = useSession();

  const [originalValues, setOriginalValues] = useState<FormValues | null>(null);

  const defaultValues: Record<string, string | boolean> = {
    role: UserRole.student,
    email: "",
    phone: "",
    city: "",
    firstName: "",
    lastName: "",
    fullName: "",
    cpf: "",
    state: "",
    isTwoFactorEnabled: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (userData) {
      Object.entries(userData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });

      form.setValue(
        "role",
        (userData.role.toLowerCase() as "admin" | "teacher" | "student") ??
          "student"
      );
      form.setValue("email", userData.email ?? "");
      form.setValue("phone", userData.phone ?? "");
      form.setValue("city", userData.city ?? "");
      form.setValue("firstName", userData.name.split(" ")[0] ?? "");
      form.setValue("lastName", userData.name.split(" ")[1] ?? "");
      form.setValue("fullName", userData.name ?? "");
      form.setValue("cpf", userData.cpf ?? "");
      form.setValue("state", userData.state ?? "");
      form.setValue("isTwoFactorEnabled", userData.isTwoFactorEnabled ?? false);

      const values: FormValues = {
        role: userData.role as any,
        email: userData.email ?? "",
        phone: userData.phone ?? "",
        city: userData.city ?? "",
        state: userData.state ?? "",
        firstName: userData.name.split(" ")[0] ?? "",
        lastName: userData.name.split(" ")[1] ?? "",
        fullName: userData.name ?? "",
        cpf: userData.cpf ?? "",
        isTwoFactorEnabled: userData.isTwoFactorEnabled ?? false,
        photo: undefined,

        // imageUrl: userData.imageUrl || undefined,
        // isTwoFactorEnabled: userData.isTwoFactorEnabled,
      };

      form.reset(values);
      setOriginalValues(values);
    }
  }, [userData, form]);

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const data = await updateMe(values);

        if (data.error) toast(data.error);
        if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["profile"],
          });
          // queryClient.removeQueries({
          //   queryKey: ["profile", ],
          // });

          update();

          toast.success("Perfil atualizado com sucesso!");
          setOriginalValues(values);
          form.reset(values);
        }
      } catch {
        toast.error("Erro ao atualizar o perfil. Por favor, tente novamente.");
      }
    });
  }

  function handleCancel() {
    if (originalValues) {
      form.reset(originalValues);
    }
  }

  const hasChanges = Object.keys(dirtyFields).length > 0;

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Configurações do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonProfile />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="col-span-1 flex flex-col items-center space-y-4">
                    <ImageUploadField
                      form={form}
                      name="photo"
                      isPending={isPending}
                      initialImageUrl={userData?.imageUrl ?? undefined}
                      userType={userData?.role || UserRole.student}
                    />
                    <FormLabel className="text-center">
                      Foto
                      {userData?.role === UserRole.student && " (opcional)"}
                    </FormLabel>
                  </div>
                  <div className="col-span-1 lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      {userData?.role === UserRole.admin ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                      <span className="font-medium">
                        {userData?.role === UserRole.admin
                          ? "Administrador"
                          : "Usuário"}
                      </span>
                    </div>
                    {userData?.role == "student" ? (
                      <>
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isPending}
                                  {...field}
                                  className="bg-background"
                                />
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
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isPending}
                                  {...field}
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isPending}
                                  {...field}
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input
                                disabled={isPending}
                                type="email"
                                {...field}
                                className="bg-background"
                              />
                            </FormControl>
                            {userData?.isEmailVerified ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-nowrap bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Não verificado
                              </Badge>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <InputPhoneField form={form} isPending={isPending} />
                    {userData?.role !== UserRole.student && (
                      <InputCpfField form={form} isPending={isPending} />
                    )}
                    {userData?.role === UserRole.student && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Combobox
                                disabled={isPending}
                                options={estadosBrasileiros.map((e) => e.label)}
                                value={field.value || ""}
                                onSetValue={field.onChange}
                                placeholder="Selecione um estado"
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
                                <Input
                                  disabled={isPending}
                                  {...field}
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Autenticação de dois fatores
                            </FormLabel>
                            <FormDescription>
                              Aumente a segurança da sua conta ativando a
                              autenticação de dois fatores.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                              aria-readonly
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={!hasChanges}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !hasChanges}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPending ? "Atualizando..." : "Atualizar Perfil"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function fetchCurrentUser(): Promise<UserMeDTO> {
  // Implement the API call to fetch the current user's data
  const response = await fetch("/api/users/me");
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
}
