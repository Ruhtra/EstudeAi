"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/lib/user";
import { NewPasswordSchema } from "@/schemas/LoginSchema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Token ausente!" };
  }

  const validatedField = NewPasswordSchema.safeParse(values);
  if (!validatedField.success) return { error: "Campo inválido!" };

  const { password } = validatedField.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Token inválido!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token expirou!" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email não existe!" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      passwordHash: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Senha atualizada com sucesso!" };
};
