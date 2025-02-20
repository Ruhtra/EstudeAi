import { z } from "zod";

export const questionSchema = z.object({
  number: z
    .string()
    .regex(/^\d+$/, "O número da questão deve ser um inteiro positivo"),
  linkedTexts: z.array(z.string()),
  statement: z
    .string()
    .min(1, "O enunciado é obrigatório")
    .max(1000, "O enunciado deve ter no máximo 1000 caracteres"),
  discipline: z.string().min(1, "A disciplina é obrigatória"),
  alternatives: z
    .array(
      z.object({
        id: z.string().optional(),
        content: z.string().min(1, "O conteúdo da alternativa é obrigatório"),
        contentType: z.enum(["text", "image"]),
        isCorrect: z.boolean(),
      })
    )
    .min(2, "Deve haver pelo menos duas alternativas")
    .refine((alternatives) => alternatives.some((alt) => alt.isCorrect), {
      message: "Deve haver pelo menos uma alternativa correta",
    }),
});
