"use server";

import { db } from "@/lib/db";
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
    // TO-DO: inserir imagem no banco
    console.log("deveria isnerir a imagfem");

    //   let imgUrl;
    //   let imageName;
    // try {
    //   imageName = `${id}.${user.photo.name.split(".").pop()}`; // Tratamento do nome da imagem

    //   const res = await supabase.storage
    //     .from("profileImages")
    //     .upload(imageName, user.photo, {
    //       cacheControl: "3600",
    //       upsert: true,
    //     });

    //   if (res.error) throw res.error;

    //   imgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${res.data.fullPath}`; // Usando variável de ambiente
    // } catch (error) {
    //   console.error(error);
    //   return { error: "Não foi possível fazer upload de imagem" };
    // }
  }

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

  await db.text.update({
    where: { id: idText },
    data: {
      contentType: text.contentType,
      content: text.content,
      reference: text.reference,
      updatedAt: new Date(),
    },
  });

  // revalidatePath("/admin/users");
  return { success: "Text updated!" };
};

export const deleteText = async (textId: string) => {
  const text = await db.text.findUnique({
    where: {
      id: textId,
    },
  });
  if (!text) return { error: "Text not found" };

  await db.text.delete({
    where: {
      id: textId,
    },
  });

  // revalidatePath("/admin/users");
  return { success: "Text deleted" };
};
