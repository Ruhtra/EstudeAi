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

  const user = await getUserByEmail(email);
  if (!user) return { error: "Email não existe" };

  const userToken = await generatePasswordResetToken(user.email);
  const response = await sendPasswordResetEmail(
    userToken.email,
    userToken.token
  );

  if (response.error) {
    console.error(response.error);
    return {
      error:
        "Não foi possível enviar o email de redefinição de senha. Tente novamente mais tarde.",
    };
  }

  return {
    success: "Você receberá instruções no email para redefinir sua senha.",
  };
};
