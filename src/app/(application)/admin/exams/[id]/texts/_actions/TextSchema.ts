// import { z } from "zod";

// export const textSchema = z.discriminatedUnion("contentType", [
//   z.object({
//     contentType: z.literal("text"),
//     content: z.string().min(1, {
//       message: "Conteúdo é obrigatório.",
//     }),
//     reference: z.string(),
//   }),
//   z.object({
//     contentType: z.literal("image"),
//     content: z
//       .instanceof(File)
//       .refine(
//         (file) => file.size <= 5000000,
//         `Tamanho máximo do arquivo é 5MB.`
//       ),
//     reference: z.string(),
//   }),
// ]);

import { z } from "zod";

const textTextSchema = z.object({
  contentType: z.literal("text"),
  content: z.string().nonempty(),
  reference: z.string(),
});

const imageTextSchema = z.object({
  contentType: z.literal("image"),
  file: z.instanceof(File),
  reference: z.string(),
});

export const textSchema = z.discriminatedUnion("contentType", [
  textTextSchema,
  imageTextSchema,
]);

export type QuestionPayload = z.infer<typeof textSchema>;
