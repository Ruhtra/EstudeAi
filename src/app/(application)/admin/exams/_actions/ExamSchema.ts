import { z } from "zod";

export const examSchema = z.object({
  year: z
    .number()
    .min(1900, { message: "O ano deve ser após 1900." })
    .max(new Date().getFullYear(), {
      message: `O ano deve ser no máximo ${new Date().getFullYear()}.`,
    }),
  instituto: z.string().min(1, { message: "Instituto é obrigatório" }),
  banca: z.string().min(1, { message: "Banca é obrigatória" }),
  level: z.string().min(1, { message: "Nível é obrigatório" }),
  // position: z.string().min(1, { message: "Posição é obrigatória" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
});
