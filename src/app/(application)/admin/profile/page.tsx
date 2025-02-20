"use client";

import { useState, useTransition, useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { ImageUploadField } from "../users/_components/image-upload-field";
import { InputPhoneField } from "../users/_components/input-phone-field";
import { InputCpfField } from "../users/_components/input-cpf-field";

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

const cpfSchema = z
  .string()
  .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 dígitos.");

const phoneSchema = z
  .string()
  .regex(
    /^\d{2}9\d{8}$/,
    "O telefone deve conter 11 dígitos, começando com DDD seguido do número 9."
  );

const baseSchema = z.object({
  email: z.string().email("Email inválido"),
  phone: phoneSchema,
});

const collaboratorTeacherSchema = baseSchema.extend({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  cpf: cpfSchema,
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, `Tamanho máximo do arquivo é 5MB.`),
});

const subscriberSchema = baseSchema.extend({
  firstName: z
    .string()
    .min(2, "Nome é obrigatório")
    .regex(/^\S+$/, "O nome não pode conter espaços"),
  lastName: z
    .string()
    .min(2, "Sobrenome é obrigatório")
    .regex(/^\S+$/, "O nome não pode conter espaços"),
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  photo: z.optional(
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5000000,
        `Tamanho máximo do arquivo é 5MB.`
      )
  ),
});

const formSchema = z.discriminatedUnion("role", [
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.admin) }),
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.teacher) }),
  subscriberSchema.extend({ role: z.literal(UserRole.student) }),
]);

type FormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.student);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: UserRole.student,
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      state: "",
      city: "",
    },
  });

  useEffect(() => {
    // Fetch user data and set form values
    // This is a placeholder for the actual API call
    const fetchUserData = async () => {
      // Simulating API call
      const userData = {
        role: UserRole.student,
        email: "user@example.com",
        phone: "11987654321",
        firstName: "John",
        lastName: "Doe",
        state: "São Paulo",
        city: "São Paulo",
      };

      setUserRole(userData.role);
      form.reset(userData);
    };

    fetchUserData();
  }, [form]);

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      // Here you would typically call an API to update the user profile
      console.log(values);
      toast.success("Perfil atualizado com sucesso!");
    });
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Configurações do Perfil</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <ImageUploadField
                form={form}
                name="photo"
                isPending={isPending}
                userType={userRole}
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-6">
              {userRole === UserRole.student ? (
                <>
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
                </>
              ) : (
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
              )}
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
              {userRole !== UserRole.student && (
                <InputCpfField form={form} isPending={isPending} />
              )}
              {userRole === UserRole.student && (
                <>
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Combobox
                          disabled={isPending}
                          options={estadosBrasileiros}
                          value={field.value}
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
                          <Input disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Atualizando..." : "Atualizar Perfil"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
