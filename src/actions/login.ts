"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { LoginSchema } from "@/schemas/LoginSchema";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };
  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Login Successfull, redirecting..." };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };

        case "CallbackRouteError":
          if (error.cause?.err?.message == "Email does not exist")
            return { error: "Email does Not exist" };

        default:
          return { error: "An error occurred" };
      }
    }
    throw error;
  }
}
