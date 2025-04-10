"use server";

import { db } from "@/lib/db";
import cuid from "cuid";
import { z } from "zod";
import { examSchema } from "./ExamSchema";

export const createExaxm = async (data: z.infer<typeof examSchema>) => {
  console.log(data);

  const parseExam = examSchema.safeParse(data);

  if (!parseExam.success) return { error: "Invalid data" };
  const exam = parseExam.data;

  const id = cuid();

  await db.exam.create({
    data: {
      id: id,
      name: exam.name,
      year: exam.year, // Ano do exame
      // position: exam.position,
      level: exam.level,
      isComplete: false,

      bank: exam.banca,
      institute: exam.instituto,

      // Substituindo upsert por connectOrCreate para Bank
      // Bank: {
      //   connectOrCreate: {
      //     where: {
      //       name: exam.banca, // Tentando conectar com o Bank pelo ID
      //     },
      //     create: {
      //       id: cuid(),
      //       name: exam.banca, // Nome do banco
      //     },
      //   },
      // },

      // Substituindo upsert por connectOrCreate para Institute
      // Institute: {
      //   connectOrCreate: {
      //     where: {
      //       name: exam.instituto, // Tentando conectar com o Bank pelo ID
      //     },
      //     create: {
      //       id: cuid(),
      //       name: exam.instituto, // Nome do banco
      //     },
      //   },
      // },

      createdAt: new Date(), // Data de criação
      updatedAt: new Date(), // Data de atualização
    },
  });

  return { success: "Exam create!" };
};

export const updateExam = async (
  idUser: string,
  data: z.infer<typeof examSchema>
) => {
  const parseExam = examSchema.safeParse(data);

  if (!parseExam.success) return { error: "Invalid data" };
  const exam = parseExam.data;

  await db.exam.update({
    where: { id: idUser },
    data: {
      name: exam.name,
      bank: exam.banca,
      institute: exam.instituto,
      level: exam.level,
      // position: exam.position,
      updatedAt: new Date(),
      year: exam.year,
    },
  });

  // revalidatePath("/admin/users");

  return { success: "Exam updated!" };
};
export const deleteExam = async (examId: string) => {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      Question: true,
      Text: true,
    },
  });

  if (!exam) return { error: "Exam not found" };

  try {
    await db.$transaction([
      db.question.deleteMany({
        where: { examId },
      }),
      db.text.deleteMany({
        where: { examId },
      }),
      db.exam.delete({
        where: { id: examId },
      }),
    ]);

    return { success: "Exam deleted" };
  } catch {
    return { error: "Erro ao deletar o exame" };
  }
};

export const publishExam = async (examId: string) => {
  const exam = await db.exam.findUnique({
    where: {
      id: examId,
    },
  });

  if (!exam) return { error: "Exam not found" };
  if (exam.isComplete) return { error: "Exam is already published" };

  await db.exam.update({
    where: {
      id: examId,
    },
    data: {
      isComplete: true,
    },
  });

  return { success: "Exam Published" };
};

export const unPublishExam = async (examId: string) => {
  const exam = await db.exam.findUnique({
    where: {
      id: examId,
    },
  });

  if (!exam) return { error: "Exam not found" };
  if (!exam.isComplete) return { error: "Exam is not published" };

  await db.exam.update({
    where: {
      id: examId,
    },
    data: {
      isComplete: false,
    },
  });

  return { success: "Exam UnPublished" };
};
