import { z } from "zod";

export const textSchema = z.object({
  number: z.string().min(1, {
    message: "Número do texto é obrigatório.",
  }),
  contentType: z.enum(["text", "image"]),
  content: z.string().min(1, {
    message: "Conteúdo é obrigatório.",
  }),
  reference: z.string().min(1, {
    message: "Referência é obrigatória.",
  }),
});
