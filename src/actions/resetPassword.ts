"use server";
import { sendPasswordResetEmail } from "@/data/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getUserByEmail } from "@/lib/user";
import { ResetSchema } from "@/schemas/LoginSchema";
import type { z } from "zod";

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos." };
  }

  const { email } = validatedFields.data;

  console.log("email");

  console.log(email);

  const user = await getUserByEmail(email);
  if (!user) return { error: "Email not exists" };

  const userToken = await generatePasswordResetToken(user.email);
  await sendPasswordResetEmail(userToken.email, userToken.token);

  return {
    success: "Você receberá instruções no email para redefinir sua senha.",
  };
};
