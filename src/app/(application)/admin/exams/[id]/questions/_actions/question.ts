"use server";

import { z } from "zod";
import { questionSchema } from "./QuestionSchema";

export const createExaxm = async (data: z.infer<typeof questionSchema>) => {
  const parseQuestion = questionSchema.safeParse(data);

  if (!parseQuestion.success) return { error: "Invalid data" };
  // const question = parseQuestion.data;

  return { success: "Question create!" };
};

export const updateQuestion = async (
  // idUser: string,
  data: z.infer<typeof questionSchema>
) => {
  const parseQuestion = questionSchema.safeParse(data);
  if (!parseQuestion.success) return { error: "Invalid data" };

  return { success: "Question updated!" };
};

export const deleteQuestion = async (questionId: string) => {
  console.log(questionId);

  return { success: "Question deleted" };
};
