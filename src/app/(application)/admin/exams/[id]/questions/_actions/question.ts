"use server";

import { z } from "zod";
import { questionSchema } from "./QuestionSchema";
import { db } from "@/lib/db";
import cuid from "cuid";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export const createQuestion = async (
  idExam: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };
  const question = parseQuestion.data;

  const textsExist = await db.text.findMany({
    where: {
      id: {
        in: data.linkedTexts,
      },
    },
  });
  if (textsExist.length !== data.linkedTexts.length)
    return { error: "Some linked texts do not exist" };

  const examExists = await db.exam.findUnique({
    where: {
      id: idExam,
    },
  });
  if (!examExists) return { error: "Exam does not exist" };

  const uploadedImages: { key: string }[] = [];
  let alternativesData;
  try {
    alternativesData = await Promise.all(
      question.alternatives.map(async (alt) => {
        const id = cuid();

        if (alt.contentType === "image") {
          const fileName = `alternative-${randomUUID()}`;

          const res = await supabase.storage
            .from("profileImages")
            .upload("alternatives/" + fileName, alt.file, {
              cacheControl: "3600",
              upsert: true,
              contentType: alt.file.type,
            });

          if (res.error) throw res.error;
          uploadedImages.push({ key: fileName });

          return {
            id: id,
            contentType: alt.contentType,
            content: null,
            imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/alternatives/${fileName}`,
            imageKey: fileName,
            updatedAt: new Date(),
            createdAt: new Date(),
            isCorrect: alt.isCorrect,
          };
        } else {
          return {
            id: id,
            contentType: alt.contentType,
            content: alt.content,
            imageUrl: null,
            imageKey: null,
            updatedAt: new Date(),
            createdAt: new Date(),
            isCorrect: alt.isCorrect,
          };
        }
      })
    );
  } catch {
    for (const img of uploadedImages) {
      await supabase.storage
        .from("profileImages")
        .remove(["alternatives/" + img.key]);
    }

    return { error: "Error uploading images" };
  }

  try {
    await db.$transaction(
      async (tx) => {
        await tx.question.create({
          data: {
            id: cuid(),
            statement: question.statement,
            Alternative: {
              create: alternativesData.map((alt) => ({
                ...alt,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
            Discipline: {
              connectOrCreate: {
                create: {
                  id: cuid(),
                  name: question.discipline,
                },
                where: {
                  name: question.discipline,
                },
              },
            },
            Exam: {
              connect: {
                id: idExam,
              },
            },
            Text: {
              connect: question.linkedTexts.map((e) => ({
                id: e,
              })),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      },
      {
        timeout: 10000,
      }
    );

    return { success: "Questão criada com sucesso!" };
  } catch {
    for (const img of uploadedImages) {
      await supabase.storage
        .from("profileImages")
        .remove(["alternatives/" + img.key]);
    }
    return { error: "Erro ao criar questão!" };
  }

  // await db.question.create({
  //   data: {
  //     id: cuid(),
  //     statement: question.statement,
  //     Alternative: {
  //       create: await Promise.all(
  //         question.alternatives.map(async (e) => {
  //           const id = cuid();
  //           let s3Upload: { url: string; key: string } | null = null;

  //           if (e.contentType === "image") {
  //             const fileName = `text-${randomUUID()}`;

  //             const res = await supabase.storage
  //               .from("profileImages")
  //               .upload("alternatives/" + fileName, e.file, {
  //                 cacheControl: "3600",
  //                 upsert: true,
  //                 contentType: e.file.type,
  //               });

  //             if (res.error)
  //               // Em caso de erro haja de acordo
  //               s3Upload = {
  //                 url: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/texts/${fileName}`,
  //                 key: fileName,
  //               };
  //           }
  //           return {
  //             id: id,
  //             contentType: e.contentType,
  //             content: null,
  //             imageUrl: null,
  //             imageKey: null,
  //             updatedAt: new Date(),
  //             createdAt: new Date(),
  //             isCorrect: e.isCorrect,
  //           };
  //         })
  //       ),
  //     },
  //     Discipline: {
  //       connectOrCreate: {
  //         create: {
  //           id: cuid(),
  //           name: question.discipline,
  //         },
  //         where: {
  //           name: question.discipline,
  //         },
  //       },
  //     },
  //     Exam: {
  //       connect: {
  //         id: idExam,
  //       },
  //     },
  //     Text: {
  //       connect: question.linkedTexts.map((e) => ({
  //         id: e,
  //       })),
  //     },
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  // return { success: "Question create!" };
};

export const updateQuestion = async (
  idQuestion: string,
  data: z.infer<typeof questionSchema>
) => {
  // Validar os dados da questão
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };

  // Procurar a questão atual e incluir a disciplina relacionada
  const question = await db.question.findUnique({
    where: { id: idQuestion },
    include: { Discipline: true, Text: true, Alternative: true },
  });

  if (!question) return { error: "Question not found" };
  return { success: "Question updated!" };

  // Verificar se a disciplina foi alterada no update
  // const isDisciplineChanged =
  //   data.discipline && data.discipline !== question.Discipline.name;

  // const textsExist = await db.text.findMany({
  //   where: {
  //     id: {
  //       in: data.linkedTexts,
  //     },
  //   },
  // });
  // if (textsExist.length !== data.linkedTexts.length)
  //   return { error: "Some linked texts do not exist" };

  // Encontrar os textos que foram deselecionados
  // const currentTextIds = question.Text.map((t) => t.id); // Pegamos os números dos textos atuais
  // const textsToDisconnect = currentTextIds.filter(
  //   (textId) => !data.linkedTexts.includes(textId)
  // );

  // --- Tratamento para Alternatives ---
  // const currentAlternativeIds = question.Alternative.map((a) => a.id); // IDs das alternativas atuais
  // const newAlternativeIds = data.alternatives
  //   .map((e) => e.id)
  //   .filter((id) => id); // IDs das novas alternativas

  // // Identificar quais alternativas precisam ser deletadas
  // const alternativesToDelete = currentAlternativeIds.filter(
  //   (id) => !newAlternativeIds.includes(id)
  // );

  // const update = async () => {
  //   return db.question.update({
  //     where: { id: idQuestion },
  //     data: {
  //       statement: data.statement,
  //       Alternative: {
  //         create: await Promise.all(
  //           data.alternatives
  //             .filter((e) => !e.id)
  //             .map(async (e) => {
  //               const id = cuid();

  //               if (e.contentType === "image" && e.content instanceof File) {
  //                 const imageName = `alternatives/${id}.${e.content.name.split(".").pop()}`; // Tratamento do nome da imagem
  //                 const imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

  //                 const res = await supabase.storage
  //                   .from("profileImages")
  //                   .upload(imageName, e.content, {
  //                     cacheControl: "3600",
  //                     upsert: true,
  //                   });

  //                 if (res.error) throw res.error;

  //                 return {
  //                   id: id,
  //                   content: imgUrl,
  //                   updatedAt: new Date(),
  //                   createdAt: new Date(),
  //                   contentType: e.contentType,
  //                   isCorrect: e.isCorrect,
  //                 };
  //               } else if (typeof e.content === "string") {
  //                 return {
  //                   id: id,
  //                   content: e.content,
  //                   updatedAt: new Date(),
  //                   createdAt: new Date(),
  //                   contentType: e.contentType,
  //                   isCorrect: e.isCorrect,
  //                 };
  //               } else {
  //                 throw new Error("Invalid content type");
  //               }
  //             })
  //         ),
  //         // Atualizar as alternativas existentes
  //         update: await Promise.all(
  //           data.alternatives
  //             .filter((e) => e.id)
  //             .map(async (e) => {
  //               console.log("----------------------");
  //               console.log(e.contentType);

  //               if (e.contentType === "image" && e.content instanceof File) {
  //                 const imageName = `alternatives/${e.id}.${e.content.name.split(".").pop()}`; // Tratamento do nome da imagem
  //                 const imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

  //                 const res = await supabase.storage
  //                   .from("profileImages")
  //                   .upload(imageName, e.content, {
  //                     cacheControl: "3600",
  //                     upsert: true,
  //                   });

  //                 if (res.error) throw res.error;

  //                 return {
  //                   where: { id: e.id },
  //                   data: {
  //                     content: imgUrl,
  //                     contentType: e.contentType,
  //                     isCorrect: e.isCorrect,
  //                     updatedAt: new Date(),
  //                   },
  //                 };
  //               } else if (typeof e.content === "string") {
  //                 return {
  //                   where: { id: e.id },
  //                   data: {
  //                     content: e.content,
  //                     contentType: e.contentType,
  //                     isCorrect: e.isCorrect,
  //                     updatedAt: new Date(),
  //                   },
  //                 };
  //               } else {
  //                 throw new Error("Invalid content type");
  //               }
  //             })
  //         ),
  //         // Deletar alternativas que não estão mais na lista
  //         delete: alternativesToDelete.map((id) => ({ id })),
  //       },
  //       Discipline: {
  //         connectOrCreate: {
  //           create: {
  //             id: cuid(),
  //             name: data.discipline,
  //           },
  //           where: {
  //             name: data.discipline,
  //           },
  //         },
  //       },
  //       Text: {
  //         connect: data.linkedTexts.map((e) => ({
  //           id: e,
  //         })),
  //         // Desconectar textos deselecionados
  //         disconnect: textsToDisconnect.map((textId) => ({
  //           id: textId,
  //         })),
  //       },

  //       updatedAt: new Date(),
  //     },
  //   });
  // };

  // if (isDisciplineChanged) {
  //   // Contar o número de questões associadas à disciplina atual da questão
  //   const questionCount = await db.question.count({
  //     where: { disciplineId: question.disciplineId },
  //   });

  //   if (questionCount === 1) {
  //     // Se for a última questão da disciplina atual, deletar a disciplina junto com o update da questão
  //     await db.$transaction(async (prisma) => {
  //       await update(); // Chama a função async normalmente
  //       await prisma.discipline.delete({
  //         where: { id: question.disciplineId },
  //       });
  //     });

  //     return { success: "Question updated and discipline deleted!" };
  //   } else {
  //     // Apenas atualizar a questão
  //     await update();

  //     return { success: "Question updated and discipline retained!" };
  //   }
  // } else {
  //   // Caso a disciplina não tenha mudado, atualizar normalmente
  //   await update();

  //   return { success: "Question updated!" };
  // }
};

export const deleteQuestion = async (questionId: string) => {
  const question = await db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      Discipline: true,
      Alternative: true,
    },
  });

  if (!question) return { error: "Question does not exist" };

  const questionCount = await db.question.count({
    where: {
      Discipline: {
        name: question.Discipline.name,
      },
    },
  });

  const imageKeys: string[] = question.Alternative.filter(
    (alt) => alt.contentType == "image" && alt.imageKey
  ).map((alt) => alt.imageKey!);

  try {
    await db.$transaction(
      async (tx) => {
        await tx.alternative.deleteMany({
          where: { questionId: questionId },
        });
        await tx.question.delete({
          where: { id: questionId },
        });
        // Deletar as imagens associadas às alternativas
        if (imageKeys.length > 0)
          await supabase.storage
            .from("profileImages")
            .remove(imageKeys.map((e) => "alternatives/" + e));

        if (questionCount == 1) {
          await tx.discipline.delete({
            where: { name: question.Discipline.name },
          });
        }
      },
      {
        timeout: 10000,
      }
    );
  } catch {
    return { error: "Erro ao remover questão" };
  }
  return { success: "Question deleted" };
};
