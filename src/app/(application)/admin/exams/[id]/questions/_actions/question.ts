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
      number: question.number.toString(),
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
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };

  console.log(idQuestion);

  return { success: "Question updated!" };
};

export const deleteQuestion = async (questionId: string) => {
  if (questionId == "12") return { error: "fffff" };

  console.log(questionId);

  return { success: "Question deleted" };
};
