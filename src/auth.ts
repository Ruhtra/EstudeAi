import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import "next-auth/jwt";
export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },

  cookies: {
    sessionToken: {
      name: "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        secure: true, // TO-DO: Garante que cookies sejam seguros em produção
        sameSite: "none",
        path: "/",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
