import { type NextAuthConfig, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas/LoginSchema";
import { getUserByEmail, getUserById } from "./lib/user";

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default {
  providers: [
    // Google({
    //   clientId: GOOGLE_CLIENT_ID,
    //   clientSecret: GOOGLE_CLIENT_SECRET,
    // }),
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.passwordHash)
            throw new Error("Email does not exist");

          const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!passwordMatch) return null;

          return {
            role: user.role,
            email: user.email,
            id: user.id,
            image: user.imageurl,
            name: user.name,
            hasPayment: user.hasPayment,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },

    async signIn({ user, account }) {
      if (account?.type !== "credentials") return true;

      //I Write this throw for supress error in user
      //if this throw for execute, validate why user can be null
      if (!user.id) throw new Error("Usuário não contém id");

      // const existingUser = await getUserById(user.id);

      //Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      // if (token.sub && session.user) {
      //   session.user.id = token.sub;
      //   session.user.id = token.sub;

      //   let user;
      //   try {
      //     user = await getUserById(session.user.id);
      //   } catch (error) {}

      //   if (user) {
      //     session.user.name = user.name;
      //     session.user.email = user.email;
      //     session.user.imageurl = user.imageurl;
      //   }
      // }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.imageurl = token.picture;
        session.user.email = token.email;
        session.user.hasPayment = token.hasPayment;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      //TO-DO: Verificar sobre a possiilide de manter o token sendo atualizado pelo banco de dados
      //       Pois a atualização de role e dados do suuário se mantém sempre atualizado

      let userr;
      try {
        userr = await getUserById(token.sub!);
      } catch { }

      if (!userr) return token;
      // if (!user) return token;
      if (!userr.email)
        throw new Error("userr does not email in jwt callback!");

      token.name = userr.name;
      token.picture = userr.imageurl;
      token.email = userr.email;
      token.role = userr.role;
      token.hasPayment = userr.hasPayment;

      return token;
    },
  },
} satisfies NextAuthConfig;
