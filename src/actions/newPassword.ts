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
    return { error: "Missing token!" };
  }

  const validatedField = NewPasswordSchema.safeParse(values);
  if (!validatedField.success) return { error: "Invalid Field!" };

  const { password } = validatedField.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };

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

  return { success: "Password updated!" };
};
