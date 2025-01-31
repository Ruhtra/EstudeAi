import { UserRole } from "@prisma/client";
import { z } from "zod";

const baseSchema = z.object({
  email: z.string().email("Email inválido"),
  phone: z.string().min(14, "Telefone inválido"),
});

const collaboratorTeacherSchema = baseSchema.extend({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
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

export const formSchema = z.discriminatedUnion("role", [
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.admin) }),
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.teacher) }),
  subscriberSchema.extend({ role: z.literal(UserRole.student) }),
]);
