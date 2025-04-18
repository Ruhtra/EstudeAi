import { UserRole } from "@prisma/client";
import { z } from "zod";

const cpfSchema = z
  .string()
  .regex(/^\d{11}$/, "O CPF deve conter exatamente 11 dígitos.");

// Validação para Telefone - DDD + "9" + 8 dígitos (total de 11 dígitos)
const phoneSchema = z
  .string()
  .regex(
    /^\d{2}9\d{8}$/,
    "O telefone deve conter 11 dígitos, começando com DDD seguido do número 9."
  );

const baseSchema = z.object({
  email: z.string().email("Email inválido"),
  isTwoFactorEnabled: z.boolean(),
  phone: phoneSchema, // adicionar validção de telefone
});

const collaboratorTeacherSchema = baseSchema.extend({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  // cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
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

export const profileSchema = z.discriminatedUnion("role", [
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.admin) }),
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.teacher) }),
  collaboratorTeacherSchema.extend({ role: z.literal(UserRole.sup) }),
  subscriberSchema.extend({ role: z.literal(UserRole.student) }),
]);
