"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import cuid from "cuid";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { questionSchema } from "./QuestionSchema";

/* CREATE QUESTION */
export const createQuestion = async (
  idExam: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };
  const question = parseQuestion.data;

  // Validação de textos vinculados e existência do exame
  const textsExist = await db.text.findMany({
    where: { id: { in: question.linkedTexts } },
  });
  if (textsExist.length !== question.linkedTexts.length)
    return { error: "Some linked texts do not exist" };

  const examExists = await db.exam.findUnique({
    where: { id: idExam },
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
            id,
            contentType: alt.contentType,
            content: null,
            imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/alternatives/${fileName}`,
            imageKey: fileName,
            createdAt: new Date(),
            updatedAt: new Date(),
            isCorrect: alt.isCorrect,
          };
        } else {
          return {
            id,
            contentType: alt.contentType,
            content: alt.content,
            imageUrl: null,
            imageKey: null,
            createdAt: new Date(),
            updatedAt: new Date(),
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
              create: alternativesData.map((alt: any) => ({
                ...alt,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
            Discipline: {
              connectOrCreate: {
                create: { id: cuid(), name: question.discipline },
                where: { name: question.discipline },
              },
            },
            Exam: { connect: { id: idExam } },
            Text: { connect: question.linkedTexts.map((e) => ({ id: e })) },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      },
      { timeout: 10000 }
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
};

/* UPDATE QUESTION */
export const updateQuestion = async (
  idQuestion: string,
  idExam: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };
  const question = parseQuestion.data;

  // Validação dos textos vinculados e do exame
  const textsExist = await db.text.findMany({
    where: { id: { in: question.linkedTexts } },
  });
  if (textsExist.length !== question.linkedTexts.length)
    return { error: "Some linked texts do not exist" };
  const examExists = await db.exam.findUnique({
    where: { id: idExam },
  });
  if (!examExists) return { error: "Exam does not exist" };

  const existingQuestion = await db.question.findUnique({
    where: { id: idQuestion },
    include: { Alternative: true, Discipline: true, Text: true },
  });
  if (!existingQuestion) return { error: "Question not found" };

  // Determinar quais textos precisam ser desconectados
  const currentTextIds = existingQuestion.Text.map((t) => t.id);
  const textsToDisconnect = currentTextIds.filter(
    (textId) => !question.linkedTexts.includes(textId)
  );

  // No update, todas as alternativas passam por parâmetro. Antes de fazer os uploads,
  // capturamos as chaves de todas as imagens atuais para remoção após a transação.
  const oldImageKeys: string[] = existingQuestion.Alternative.filter(
    (alt) => alt.contentType === "image" && alt.imageKey
  ).map((alt) => alt.imageKey!);

  const newUploadedImages: { key: string }[] = [];

  // Verificar se a disciplina foi alterada no update
  const isDisciplineChanged =
    data.discipline && data.discipline !== existingQuestion.Discipline.name;
  let questionCount: number;
  if (isDisciplineChanged) {
    questionCount = await db.question.count({
      where: { disciplineId: existingQuestion.disciplineId },
    });
  }

  // Processar alternativas: para alternativas sem id, fará create; para as com id, fará update
  let createAlternatives;
  let updateAlternatives;
  try {
    // Alternativas para criar (novas, sem id)
    createAlternatives = await Promise.all(
      question.alternatives
        .filter((e) => !e.id)
        .map(async (e) => {
          const newId = cuid();
          if (e.contentType === "image") {
            // Upload de imagem para nova alternativa
            const imageName = `alternative-${randomUUID()}`;
            const res = await supabase.storage
              .from("profileImages")
              .upload("alternatives/" + imageName, e.file, {
                cacheControl: "3600",
                upsert: true,
                contentType: e.file.type,
              });
            if (res.error) throw res.error;
            newUploadedImages.push({ key: imageName });
            return {
              id: newId,
              contentType: e.contentType,
              content: null,
              imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/alternatives/${imageName}`,
              imageKey: imageName,
              isCorrect: e.isCorrect,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          } else if (e.contentType === "text") {
            return {
              id: newId,
              contentType: e.contentType,
              content: e.content,
              imageUrl: null,
              imageKey: null,
              isCorrect: e.isCorrect,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          } else {
            throw new Error("Invalid alternative content");
          }
        })
    );
    // Alternativas para atualizar (já existentes)
    updateAlternatives = await Promise.all(
      question.alternatives
        .filter((e) => e.id)
        .map(async (e) => {
          // Se o alternative for do tipo image e for enviado novo arquivo, faz upload e atualiza
          if (e.contentType === "image") {
            // if (e.file instanceof File) {
            const imageName = `alternative-${randomUUID()}`;
            const res = await supabase.storage
              .from("profileImages")
              .upload("alternatives/" + imageName, e.file, {
                cacheControl: "3600",
                upsert: true,
                contentType: e.file.type,
              });
            if (res.error) throw res.error;
            newUploadedImages.push({ key: imageName });
            return {
              where: { id: e.id },
              data: {
                content: null,
                contentType: e.contentType,
                imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/alternatives/${imageName}`,
                imageKey: imageName,
                isCorrect: e.isCorrect,
                updatedAt: new Date(),
              },
            };
          } else if (e.contentType === "text") {
            return {
              where: { id: e.id },
              data: {
                contentType: e.contentType,
                content: e.content,
                imageUrl: null,
                imageKey: null,
                isCorrect: e.isCorrect,
                updatedAt: new Date(),
              },
            };
          } else {
            throw new Error("Invalid alternative type");
          }
        })
    );
  } catch {
    for (const img of newUploadedImages) {
      await supabase.storage
        .from("profileImages")
        .remove(["alternatives/" + img.key]);
    }
    return { error: "Error uploading images" };
  }

  try {
    await db.$transaction(
      async (tx) => {
        // Deleta alternativas que não estão na nova lista
        const currentAltIds = existingQuestion.Alternative.map((a) => a.id);
        const newAltIds = question.alternatives
          .filter((e) => e.id)
          .map((e) => e.id);
        const alternativesToDelete = currentAltIds.filter(
          (id) => !newAltIds.includes(id)
        );
        if (alternativesToDelete.length > 0) {
          await tx.alternative.deleteMany({
            where: { id: { in: alternativesToDelete } },
          });
        }
        // Atualiza a questão e suas relações
        await tx.question.update({
          where: { id: idQuestion },
          data: {
            statement: question.statement,
            Discipline: {
              connectOrCreate: {
                create: { id: cuid(), name: question.discipline },
                where: { name: question.discipline },
              },
            },
            Exam: { connect: { id: idExam } },
            Text: {
              connect: question.linkedTexts.map((id) => ({ id })),
              disconnect: textsToDisconnect.map((id) => ({ id })),
            },
            updatedAt: new Date(),
          },
        });

        // Executa os nested writes para create e update de alternativas
        if (createAlternatives.length > 0) {
          await tx.alternative.createMany({
            data: createAlternatives.map((alt) => ({
              ...alt,
              questionId: idQuestion,
            })),
          });
        }
        if (updateAlternatives.length > 0) {
          for (const updateOp of updateAlternatives) {
            await tx.alternative.update({
              where: updateOp.where,
              data: updateOp.data,
            });
          }
        }

        // Se o nome da disciplina foi alterado, desconecta a antiga e conecta a nova
        if (questionCount === 1) {
          await tx.discipline.delete({
            where: { name: existingQuestion.Discipline.name },
          });
        }
      },
      { timeout: 20000 }
    );
    // Após a transação, remove todas as imagens antigas
    if (oldImageKeys.length > 0) {
      await supabase.storage
        .from("profileImages")
        .remove(oldImageKeys.map((key) => "alternatives/" + key));
    }
    return { success: "Question updated successfully" };
  } catch {
    for (const img of newUploadedImages) {
      await supabase.storage
        .from("profileImages")
        .remove(["alternatives/" + img.key]);
    }
    return { error: "Erro ao atualizar questão" };
  }
};

/* DELETE QUESTION */
export const deleteQuestion = async (questionId: string) => {
  const question = await db.question.findUnique({
    where: { id: questionId },
    include: { Discipline: true, Alternative: true },
  });
  if (!question) return { error: "Question does not exist" };

  const questionCount = await db.question.count({
    where: {
      Discipline: {
        name: question.Discipline.name,
      },
    },
  });
  const imageKeys = question.Alternative.filter(
    (alt) => alt.contentType === "image" && alt.imageKey
  ).map((alt) => alt.imageKey!);

  try {
    await db.$transaction(
      async (tx) => {
        await tx.alternative.deleteMany({ where: { questionId } });
        await tx.question.delete({ where: { id: questionId } });
        if (imageKeys.length > 0) {
          await supabase.storage
            .from("profileImages")
            .remove(imageKeys.map((key) => "alternatives/" + key));
          if (questionCount == 1) {
            await tx.discipline.delete({
              where: { name: question.Discipline.name },
            });
          }
        }
      },
      { timeout: 10000 }
    );
    return { success: "Question deleted" };
  } catch {
    return { error: "Erro ao remover questão" };
  }
};
