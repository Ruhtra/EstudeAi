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
      position: exam.position,
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
      position: exam.position,
      updatedAt: new Date(),
      year: exam.year,
    },
  });

  // revalidatePath("/admin/users");

  return { success: "Exam updated!" };
};

export const deleteExam = async (examId: string) => {
  const exam = await db.exam.findUnique({
    where: {
      id: examId,
    },
  });

  if (!exam) return { error: "Exam not found" };

  // if (user.imageName) {
  //   try {
  //     const existingImage = `profileImages/${user.imageName}`;
  //     await supabase.storage.from("profileImages").remove([existingImage]);
  //   } catch (error) {
  //     console.error("Erro ao deletar imagem existente:", error);
  //     return { error: "Erro ao deletar imagem existente" };
  //   }
  // }

  await db.exam.delete({
    where: {
      id: examId,
    },
  });

  // revalidatePath("/admin/users");
  return { success: "Exam deleted" };
};
