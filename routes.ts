import { UserRole } from "@prisma/client";

export const publicRoutes = ["/auth/new-verification", "/erro"];

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-password",
  "/auth/new-password",
];
export const adminRoutes = ["/admin/dashboard", "/admin/exams", "/admin/users"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT: Record<UserRole, string> = {
  [UserRole.admin]: '/admin/dashboard',
  [UserRole.teacher]: '/admin/dashboard',
  [UserRole.sup]: '/admin/dashboard',
  [UserRole.student]: '/student/',
};