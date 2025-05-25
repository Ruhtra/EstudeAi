// import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  apiAuthPrefix,
  apiSubscriptionRoutes,
  apiSubscriptionWebhookRoutes,
  authRoutes,
  planRoutes,
  publicRoutes,
} from "@/../routes";
import { UserRole } from "@prisma/client";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  // const token = await getToken({
  //   req,
  //   secret: process.env.AUTH_SECRET,
  //   // raw: true,
  //   secureCookie: true,
  //   cookieName: "__Secure-authjs.session-token",
  // });

  const role = req.auth?.user.role as UserRole;
  const hasPayment = req.auth?.user.hasPayment as boolean | undefined;

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
  const isPlanRoute = planRoutes.includes(nextUrl.pathname);
  const isApiSubscriptionRoute = apiSubscriptionRoutes.includes(nextUrl.pathname)
  const isApiSubscriptionWebhookRoute = apiSubscriptionWebhookRoutes.includes(nextUrl.pathname);

  if (isApiSubscriptionWebhookRoute) return;

  if (isApiAuthRoute) return;
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT[role], nextUrl));
    }
    return;
  }

  // Redireciona para login se o usuário não está autenticado e a rota não é pública
  if (!isLoggedIn && !isPublicRoute)
    return Response.redirect(new URL("/auth/login", nextUrl));

  // Redireciona para 404 se a rota é de admin e o usuário não tem permissão adequada
  if (isAdminRoute && !["admin", "sup", "teacher"].includes(role))
    return Response.redirect(new URL("/404", nextUrl));

  // Libera todas as rotas que começam com /api/subscription apenas para estudantes
  if (role === "student") {
    if (isApiSubscriptionRoute) return;

    // Redireciona para pagamentos se o usuário é estudante e não possui pagamento ativo
    if (!hasPayment && !isPlanRoute) {
      return Response.redirect(new URL("/plans", nextUrl));
    }

    // Redireciona para default se o usuário acessar /plans
    if (hasPayment && isPlanRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT[role], nextUrl));
    }
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
