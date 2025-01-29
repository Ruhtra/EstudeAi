import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas/LoginSchema";
import { getUserByEmail } from "./lib/user";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.passwordHash) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!passwordMatch) return null;

          return {
            // role: user.role,
            email: user.email,
            id: user.id,
            image: user.image,
            name: user.name,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
