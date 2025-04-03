"use server";

import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import cuid from "cuid";
import { z } from "zod";
import { textSchema } from "./TextSchema";

export const createText = async (
  data: z.infer<typeof textSchema>,
  idExam: string
) => {
  const parseText = textSchema.safeParse(data);

  if (!parseText.success) return { error: "Invalid data" };
  const text = parseText.data;

  //validar se o examID existe no banco
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

  if (text.contentType === "image" && text.content) {
    let imgUrl: string;
    let imageName: string;
    imageName = `texts/${id}.${text.content.name.split(".").pop()}`; // Tratamento do nome da imagem
    imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

    const res = await supabase.storage
      .from("profileImages")
      .upload(imageName, text.content, {
        cacheControl: "3600",
        upsert: true,
      });

    if (res.error) throw res.error;

    await db.text.create({
      data: {
        id: id,
        number: nextNumber,
        contentType: text.contentType,
        content: imgUrl,
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
  } else if (text.contentType == "text") {
    await db.text.create({
      data: {
        id: id,
        number: nextNumber,
        contentType: text.contentType,
        content: text.content,
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

  //TO-do: validar se a imagem existe e deletar e inserir nova
  if (text.contentType === "image" && text.content) {
    let imageName = `texts/${idText}.${text.content.name.split(".").pop()}`; // Tratamento do nome da imagem
    let imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/profileImages/${imageName}`;

    const transaction = await db.$transaction(async (prisma) => {
      const updatedText = await prisma.text.update({
        where: { id: idText },
        data: {
          contentType: text.contentType,
          content: imgUrl,
          reference: text.reference,
          updatedAt: new Date(),
        },
      });

      const res = await supabase.storage
        .from("profileImages")
        .upload(imageName, text.content, {
          cacheControl: "3600",
          upsert: true,
        });

      if (res.error) throw res.error;

      return updatedText;
    });

    if (!transaction) return { error: "Falha na transação" };
  } else if (text.contentType == "text") {
    const transaction = await db.$transaction(async (prisma) => {
      const existingImage = `profileImages/texts/${textData.id}.${textData.content.split(".").pop()}`;
      const updatedText = await prisma.text.update({
        where: { id: idText },
        data: {
          contentType: text.contentType,
          content: text.content,
          reference: text.reference,
          updatedAt: new Date(),
        },
      });

      if (textData.contentType == "image") {
        const res = await supabase.storage
          .from("profileImages")
          .remove([existingImage]);
        if (res.error) throw res.error;

        return updatedText;
      }
    });

    if (!transaction) return { error: "Falha na transação" };
  }

  return { success: "Text updated!" };
};

export const deleteText = async (textId: string) => {
  const text = await db.text.findUnique({
    where: {
      id: textId,
    },
  });
  if (!text) return { error: "Text not found" };

  const transaction = await db.$transaction(async (prisma) => {
    const existingImage = `profileImages/texts/${text.id}.${text.content.split(".").pop()}`;
    const deletedText = await prisma.text.delete({
      where: {
        id: textId,
      },
    });

    if (text.contentType == "image") {
      const res = await supabase.storage
        .from("profileImages")
        .remove([existingImage]);
      if (res.error) throw res.error;

      return deletedText;
    }
  });

  if (!transaction) return { error: "Falha na transação" };

  // revalidatePath("/admin/users");
  return { success: "Text deleted" };
};
