import { z } from "zod";

export const textSchema = z.object({
  contentType: z.enum(["text", "image"]),
  content: z.string().min(1, {
    message: "Conteúdo é obrigatório.",
  }),
  reference: z.string(),
});
