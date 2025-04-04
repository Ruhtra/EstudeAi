import { z } from "zod";

export const alternativeSchema = z.discriminatedUnion("contentType", [
  z.object({
    contentType: z.literal("text"),
    content: z.string().min(1, "O conteúdo da alternativa é obrigatório"),
    isCorrect: z.boolean(),
    id: z.string().optional(),
  }),
  z.object({
    contentType: z.literal("image"),
    content: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5000000,
        "Tamanho máximo do arquivo é 5MB."
      ),
    isCorrect: z.boolean(),
    id: z.string().optional(),
  }),
]);

export const questionSchema = z.object({
  linkedTexts: z.array(z.string()),
  statement: z
    .string()
    .min(1, "O enunciado é obrigatório")
    .max(1000, "O enunciado deve ter no máximo 1000 caracteres"),
  discipline: z.string().min(1, "A disciplina é obrigatória"),
  alternatives: z
    .array(alternativeSchema)
    .min(2, "Deve haver pelo menos duas alternativas")
    .refine((alternatives) => alternatives.some((alt) => alt.isCorrect), {
      message: "Deve haver pelo menos uma alternativa correta",
    }),
});
