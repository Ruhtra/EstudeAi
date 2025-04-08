"use server";

import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import cuid from "cuid";
import { z } from "zod";
import { textSchema } from "./TextSchema";
import { randomUUID } from "crypto";

export const createText = async (
  data: z.infer<typeof textSchema>,
  idExam: string
) => {
  const parseText = textSchema.safeParse(data);

  if (!parseText.success) return { error: "Invalid data" };
  const text = parseText.data;

  const exam = await db.exam.findUnique({
    where: { id: idExam },
  });
  if (!exam) return { error: "Exam ID not found" };

  // Busca o maior número já utilizado para esse examId
  const lastText = await db.text.findFirst({
    where: {
      Exam: {
        id: idExam,
      },
    },
    orderBy: { number: "desc" }, // Ordena pelo maior 'number'
  });

  const nextNumber = lastText ? lastText.number + 1 : 1;

  const id = cuid();
  let s3Upload: { url: string; key: string } | null = null;

  try {
    if (text.contentType === "image") {
      const fileName = `text-${randomUUID()}`;

      const res = await supabase.storage
        .from("profileImages")
        .upload("texts/" + fileName, text.file, {
          cacheControl: "3600",
          upsert: true,
          contentType: text.file.type,
        });

      if (res.error) throw res.error;

      s3Upload = {
        url: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/texts/${fileName}`,
        key: fileName,
      };
    }

    await db.text.create({
      data: {
        id: id,
        number: nextNumber,
        contentType: text.contentType,
        content: text.contentType === "text" ? text.content : null,
        imageUrl: s3Upload?.url || null,
        imageKey: s3Upload?.key || null,
        reference: text.reference,
        Exam: {
          connect: {
            id: idExam,
          },
        },
        createdAt: new Date(), // Data de criação
        updatedAt: new Date(), // Data de atualização
      },
    });
  } catch {
    if (s3Upload) {
      await supabase.storage
        .from("profileImages")
        .remove(["texts/" + s3Upload.key]);
    }
    return { error: "Erro ao criar questão" };
  }

  return { success: "Text created!" };
};

export const updateText = async (
  idText: string,
  data: z.infer<typeof textSchema>
) => {
  const parseText = textSchema.safeParse(data);
  if (!parseText.success) return { error: "Invalid data" };
  const text = parseText.data;

  const textData = await db.text.findUnique({
    where: { id: idText },
  });
  if (!textData) return { error: "Text not found" };

  //validar se o examID existe no banco
  const exam = await db.exam.findUnique({
    where: { id: textData.examId },
  });
  if (!exam) return { error: "Exam ID not found" };

  let newUpload: { url: string; key: string } | null = null;
  let oldUpload: { url: string; key: string } | null = null;

  if (textData.imageUrl && textData.imageKey) {
    oldUpload = {
      url: textData.imageUrl,
      key: textData.imageKey,
    };
  }

  try {
    if (text.contentType === "image") {
      const fileName = `text-${randomUUID()}`;

      const res = await supabase.storage
        .from("profileImages")
        .upload("texts/" + fileName, text.file, {
          cacheControl: "3600",
          upsert: true,
          contentType: text.file.type,
        });

      if (res.error) throw res.error;
      newUpload = {
        url: `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/texts/${fileName}`,
        key: fileName,
      };
    }

    await db.text.update({
      where: { id: idText },
      data: {
        contentType: text.contentType,
        content: text.contentType === "text" ? text.content : null,
        imageUrl: newUpload?.url || null,
        imageKey: newUpload?.key || null,
        reference: text.reference,
        updatedAt: new Date(),
      },
    });

    if (oldUpload) {
      supabase.storage
        .from("profileImages")
        .remove(["texts/" + oldUpload.key])
        .catch((err) => {
          console.error("Error removing old image:", err);
        });
    }

    return { success: "Texto atualizada com sucesso!" };
  } catch {
    if (newUpload) {
      await supabase.storage
        .from("profileImages")
        .remove(["texts/" + newUpload.key]);
    }
    return { error: "Erro ao atualizar texto!" };
  }
};

export const deleteText = async (textId: string) => {
  const text = await db.text.findUnique({
    where: {
      id: textId,
    },
  });
  if (!text) return { error: "Texto não encontrado!" };

  await db.text.delete({
    where: {
      id: textId,
    },
  });

  if (text.contentType == "image") {
    const res = await supabase.storage
      .from("profileImages")
      .remove(["texts/" + text.imageKey]);
    if (res.error) throw res.error;
  }

  return { success: "Texto deletado com sucesso!" };
};
