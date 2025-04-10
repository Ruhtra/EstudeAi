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
            isAnnulled: question.isAnnulled,
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
  const parseResult = questionSchema.safeParse(data);
  if (!parseResult.success) return { error: "Invalid data" };
  const question = parseResult.data;

  // 1) Buscas iniciais em paralelo: textos vinculados, exame e questão existente
  const [textsExist, examExists, existingQuestion] = await Promise.all([
    db.text.findMany({ where: { id: { in: question.linkedTexts } } }),
    db.exam.findUnique({ where: { id: idExam } }),
    db.question.findUnique({
      where: { id: idQuestion },
      include: { Alternative: true, Discipline: true, Text: true },
    }),
  ]);

  if (textsExist.length !== question.linkedTexts.length)
    return { error: "Some linked texts do not exist" };
  if (!examExists) return { error: "Exam does not exist" };
  if (!existingQuestion) return { error: "Question not found" };

  // 2) Determina textos a desconectar
  const currentTextIds = existingQuestion.Text.map((t) => t.id);
  const textsToDisconnect = currentTextIds.filter(
    (textId) => !question.linkedTexts.includes(textId)
  );

  // 3) Prepara remoção de imagens antigas e array para novas uploads
  const oldImageKeys = existingQuestion.Alternative.filter(
    (alt) => alt.contentType === "image" && alt.imageKey
  ).map((alt) => alt.imageKey!) as string[];
  const newUploadedImages: string[] = [];

  // 4) Verifica mudança de disciplina e conta questões (se necessário)
  const isDisciplineChanged =
    data.discipline && data.discipline !== existingQuestion.Discipline.name;
  const questionCountPromise = isDisciplineChanged
    ? db.question.count({
        where: { disciplineId: existingQuestion.disciplineId },
      })
    : Promise.resolve(0);

  // 5) Prepara alternativas de create e update em paralelo
  const createAlternatives: any = [];
  const updateAlternatives: Array<{ where: any; data: any }> = [];

  try {
    // cria todas as promises de processamento de alternativa
    const altOps = question.alternatives.map(async (e) => {
      // cria novo ID para cada alternativa
      const id = e.id ?? cuid();

      if (e.contentType === "image") {
        // upload de imagem (novo ou substituição)
        const imageName = `alternative-${randomUUID()}`;
        const { error: uploadError } = await supabase.storage
          .from("profileImages")
          .upload(`alternatives/${imageName}`, e.file, {
            cacheControl: "3600",
            upsert: true,
            contentType: e.file.type,
          });
        if (uploadError) throw uploadError;

        newUploadedImages.push(imageName);
        const record = {
          id,
          contentType: "image",
          content: null,
          imageUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/alternatives/${imageName}`,
          imageKey: imageName,
          isCorrect: e.isCorrect,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (e.id) {
          updateAlternatives.push({
            where: { id: e.id },
            data: { ...record, updatedAt: new Date() },
          });
        } else {
          createAlternatives.push(record);
        }
      } else if (e.contentType === "text") {
        const record = {
          id,
          contentType: "text",
          content: e.content,
          imageUrl: null,
          imageKey: null,
          isCorrect: e.isCorrect,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (e.id) {
          updateAlternatives.push({
            where: { id: e.id },
            data: { ...record, updatedAt: new Date() },
          });
        } else {
          createAlternatives.push(record);
        }
      } else {
        throw new Error("Invalid alternative content");
      }
    });

    await Promise.all(altOps);
  } catch {
    // em caso de falha no upload, remove todas as imagens já enviadas em paralelo
    await Promise.all(
      newUploadedImages.map((key) =>
        supabase.storage.from("profileImages").remove([`alternatives/${key}`])
      )
    );
    return { error: "Error uploading images" };
  }

  // 6) Aguarda contagem de questões (se mudou disciplina)
  const questionCount = await questionCountPromise;

  // 7) Executa a transação principal
  try {
    await db.$transaction(
      async (tx) => {
        // 7.1) Deleta alternativas removidas
        const currentAltIds = existingQuestion.Alternative.map((a) => a.id);
        const newAltIds = question.alternatives
          .filter((e) => e.id)
          .map((e) => e.id!);
        const toDelete = currentAltIds.filter((id) => !newAltIds.includes(id));
        if (toDelete.length) {
          await tx.alternative.deleteMany({ where: { id: { in: toDelete } } });
        }

        // 7.2) Atualiza questão e relações
        await tx.question.update({
          where: { id: idQuestion },
          data: {
            statement: question.statement,
            isAnnulled: question.isAnnulled,
            Discipline: {
              connectOrCreate: {
                where: { name: question.discipline },
                create: { id: cuid(), name: question.discipline },
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

        // 7.3) Cria e atualiza alternativas em paralelo
        if (createAlternatives.length) {
          await tx.alternative.createMany({
            data: createAlternatives.map((alt: any) => ({
              ...alt,
              questionId: idQuestion,
            })),
          });
        }
        await Promise.all(
          updateAlternatives.map((op) =>
            tx.alternative.update({
              where: op.where,
              data: op.data,
            })
          )
        );

        // 7.4) Se mudou disciplina e era a única questão, remove disciplina antiga
        if (isDisciplineChanged && questionCount === 1) {
          await tx.discipline.delete({
            where: { name: existingQuestion.Discipline.name },
          });
        }
      },
      { timeout: 20000 }
    );

    // 8) Remove imagens antigas em paralelo
    if (oldImageKeys.length) {
      await Promise.all(
        oldImageKeys.map((key) =>
          supabase.storage.from("profileImages").remove([`alternatives/${key}`])
        )
      );
    }

    return { success: "Question updated successfully" };
  } catch {
    // em caso de falha na transação, remove novas imagens
    await Promise.all(
      newUploadedImages.map((key) =>
        supabase.storage.from("profileImages").remove([`alternatives/${key}`])
      )
    );
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
