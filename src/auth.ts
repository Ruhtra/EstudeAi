import NextAuth, { AuthError, DefaultSession, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./lib/user";
import "next-auth/jwt";
import { UserRole } from "@prisma/client";

// Types.d.ts declare
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: UserRole;
    email: string;
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
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
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type !== "credentials") return true;

      //I Write this throw for supress error in user
      //if this throw for execute, validate why user can be null
      if (!user.id) throw new Error("Usuário não contém id");

      const existingUser = await getUserById(user.id);

      //Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.name = user.name;
      token.picture = user.image;
      token.email = user.email;
      token.role = user.role;

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  ...authConfig,
});
