"use server";

import { z } from "zod";
import { questionSchema } from "./QuestionSchema";
import { db } from "@/lib/db";
import cuid from "cuid";

export const createQuestion = async (
  idExam: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };

  const textsExist = await db.text.findMany({
    where: {
      number: {
        in: data.linkedTexts,
      },
    },
  });
  if (textsExist.length !== data.linkedTexts.length)
    return { error: "Some linked texts do not exist" };

  console.log(idExam);

  const examExists = await db.exam.findUnique({
    where: {
      id: idExam,
    },
  });
  if (!examExists) return { error: "Exam does not exist" };

  const question = parseQuestion.data;
  console.log(question);
  await db.question.create({
    data: {
      id: cuid(),
      number: question.number,
      statement: question.statement,
      Alternative: {
        create: question.alternatives.map((e) => {
          return {
            id: cuid(),
            content: e.content,
            updatedAt: new Date(),
            createdAt: new Date(),
            contentType: e.contentType,
            isCorrect: e.isCorrect,
          };
        }),
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
          number: e,
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
      number: {
        in: data.linkedTexts,
      },
    },
  });
  if (textsExist.length !== data.linkedTexts.length)
    return { error: "Some linked texts do not exist" };

  // Encontrar os textos que foram deselecionados
  const currentTextIds = question.Text.map((t) => t.number); // Pegamos os números dos textos atuais
  const textsToDisconnect = currentTextIds.filter(
    (textNumber) => !data.linkedTexts.includes(textNumber)
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
  const update = () => {
    return db.question.update({
      where: { id: idQuestion },
      data: {
        number: data.number.toString(),
        statement: data.statement,
        Alternative: {
          create: data.alternatives
            .filter((e) => !e.id)
            .map((e) => ({
              id: cuid(),
              content: e.content,
              contentType: e.contentType,
              isCorrect: e.isCorrect,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          // Atualizar as alternativas existentes
          update: data.alternatives
            .filter((e) => e.id)
            .map((e) => ({
              where: { id: e.id },
              data: {
                content: e.content,
                contentType: e.contentType,
                isCorrect: e.isCorrect,
                updatedAt: new Date(),
              },
            })),
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
            number: e,
          })),
          // Desconectar textos deselecionados
          disconnect: textsToDisconnect.map((textNumber) => ({
            number: textNumber,
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
      await db.$transaction([
        update(),
        db.discipline.delete({ where: { id: question.disciplineId } }),
      ]);

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
