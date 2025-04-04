"use server";

import { z } from "zod";
import { questionSchema } from "./QuestionSchema";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import cuid from "cuid";

export const createQuestion = async (
  idExam: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };

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

  const question = parseQuestion.data;

  await db.question.create({
    data: {
      id: cuid(),
      statement: question.statement,
      Alternative: {
        create: await Promise.all(
          question.alternatives.map(async (e) => {
            let id = cuid();

            if (e.contentType === "image" && e.content instanceof File) {
              let imgUrl: string;
              let imageName: string;
              imageName = `alternatives/${id}.${e.content.name.split(".").pop()}`; // Tratamento do nome da imagem
              imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

              const res = await supabase.storage
                .from("profileImages")
                .upload(imageName, e.content, {
                  cacheControl: "3600",
                  upsert: true,
                });

              if (res.error) throw res.error;

              return {
                id: id,
                content: imgUrl,
                updatedAt: new Date(),
                createdAt: new Date(),
                contentType: e.contentType,
                isCorrect: e.isCorrect,
              };
            } else if (typeof e.content === "string") {
              return {
                id: id,
                content: e.content,
                updatedAt: new Date(),
                createdAt: new Date(),
                contentType: e.contentType,
                isCorrect: e.isCorrect,
              };
            } else {
              throw new Error("Invalid content type");
            }
          })
        ),
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

  return { success: "Question create!" };
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

  // Verificar se a disciplina foi alterada no update
  const isDisciplineChanged =
    data.discipline && data.discipline !== question.Discipline.name;

  const textsExist = await db.text.findMany({
    where: {
      id: {
        in: data.linkedTexts,
      },
    },
  });
  if (textsExist.length !== data.linkedTexts.length)
    return { error: "Some linked texts do not exist" };

  // Encontrar os textos que foram deselecionados
  const currentTextIds = question.Text.map((t) => t.id); // Pegamos os números dos textos atuais
  const textsToDisconnect = currentTextIds.filter(
    (textId) => !data.linkedTexts.includes(textId)
  );

  // --- Tratamento para Alternatives ---
  const currentAlternativeIds = question.Alternative.map((a) => a.id); // IDs das alternativas atuais
  const newAlternativeIds = data.alternatives
    .map((e) => e.id)
    .filter((id) => id); // IDs das novas alternativas

  // Identificar quais alternativas precisam ser deletadas
  const alternativesToDelete = currentAlternativeIds.filter(
    (id) => !newAlternativeIds.includes(id)
  );

  const update = async () => {
    return db.question.update({
      where: { id: idQuestion },
      data: {
        statement: data.statement,
        Alternative: {
          create: await Promise.all(
            data.alternatives
              .filter((e) => !e.id)
              .map(async (e) => {
                let id = cuid();

                if (e.contentType === "image" && e.content instanceof File) {
                  let imgUrl: string;
                  let imageName: string;
                  imageName = `alternatives/${id}.${e.content.name.split(".").pop()}`; // Tratamento do nome da imagem
                  imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

                  const res = await supabase.storage
                    .from("profileImages")
                    .upload(imageName, e.content, {
                      cacheControl: "3600",
                      upsert: true,
                    });

                  if (res.error) throw res.error;

                  return {
                    id: id,
                    content: imgUrl,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    contentType: e.contentType,
                    isCorrect: e.isCorrect,
                  };
                } else if (typeof e.content === "string") {
                  return {
                    id: id,
                    content: e.content,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    contentType: e.contentType,
                    isCorrect: e.isCorrect,
                  };
                } else {
                  throw new Error("Invalid content type");
                }
              })
          ),
          // Atualizar as alternativas existentes
          update: await Promise.all(
            data.alternatives
              .filter((e) => e.id)
              .map(async (e) => {
                console.log("----------------------");
                console.log(e.contentType);

                if (e.contentType === "image" && e.content instanceof File) {
                  let imgUrl: string;
                  let imageName: string;
                  imageName = `alternatives/${e.id}.${e.content.name.split(".").pop()}`; // Tratamento do nome da imagem
                  imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

                  const res = await supabase.storage
                    .from("profileImages")
                    .upload(imageName, e.content, {
                      cacheControl: "3600",
                      upsert: true,
                    });

                  if (res.error) throw res.error;

                  return {
                    where: { id: e.id },
                    data: {
                      content: imgUrl,
                      contentType: e.contentType,
                      isCorrect: e.isCorrect,
                      updatedAt: new Date(),
                    },
                  };
                } else if (typeof e.content === "string") {
                  return {
                    where: { id: e.id },
                    data: {
                      content: e.content,
                      contentType: e.contentType,
                      isCorrect: e.isCorrect,
                      updatedAt: new Date(),
                    },
                  };
                } else {
                  throw new Error("Invalid content type");
                }
              })
          ),
          // Deletar alternativas que não estão mais na lista
          delete: alternativesToDelete.map((id) => ({ id })),
        },
        Discipline: {
          connectOrCreate: {
            create: {
              id: cuid(),
              name: data.discipline,
            },
            where: {
              name: data.discipline,
            },
          },
        },
        Text: {
          connect: data.linkedTexts.map((e) => ({
            id: e,
          })),
          // Desconectar textos deselecionados
          disconnect: textsToDisconnect.map((textId) => ({
            id: textId,
          })),
        },

        updatedAt: new Date(),
      },
    });
  };

  if (isDisciplineChanged) {
    // Contar o número de questões associadas à disciplina atual da questão
    const questionCount = await db.question.count({
      where: { disciplineId: question.disciplineId },
    });

    if (questionCount === 1) {
      // Se for a última questão da disciplina atual, deletar a disciplina junto com o update da questão
      await db.$transaction(async (prisma) => {
        await update(); // Chama a função async normalmente
        await prisma.discipline.delete({
          where: { id: question.disciplineId },
        });
      });

      return { success: "Question updated and discipline deleted!" };
    } else {
      // Apenas atualizar a questão
      await update();

      return { success: "Question updated and discipline retained!" };
    }
  } else {
    // Caso a disciplina não tenha mudado, atualizar normalmente
    await update();

    return { success: "Question updated!" };
  }
};

export const deleteQuestion = async (questionId: string) => {
  const question = db.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      Discipline: true,
    },
  });

  if (!question) return { error: "Question does not exist" };

  // Contar o número de questões associadas à mesma disciplina
  const questionCount = await db.question.count({
    where: {
      Discipline: {
        name: question.Discipline.name,
      },
    },
  });

  if (questionCount > 1) {
    // Deletar apenas a questão
    await db.question.delete({
      where: { id: questionId },
    });
  } else {
    // Se for a última questão, deletar a questão e a disciplina
    await db.$transaction([
      db.question.delete({ where: { id: questionId } }),
      db.discipline.delete({ where: { name: question.Discipline.name } }),
    ]);
  }

  return { success: "Question deleted" };
};
