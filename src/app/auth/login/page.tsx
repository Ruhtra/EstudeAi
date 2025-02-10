"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/login";
import type { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../routes";
import Link from "next/link";
import { UserRole } from "@prisma/client";

export default function LoginPage() {
  const route = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null | undefined>(null);
  const [error, setError] = useState<string | null | undefined>(null);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function submitForm(values: z.infer<typeof LoginSchema>) {
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      login(values)
        .then(async (data) => {
          setError(null);
          setSuccess(null);

          if (data.error) {
            form.resetField("password");
            // form.reset();
            setError(data?.error);
          }
          if (data.success) {
            form.reset();
            setSuccess(data?.success);
            const session = await update();
            const role: UserRole = session?.user.role;
            route.push(DEFAULT_LOGIN_REDIRECT[role]);
          }
        })
        .catch(() => {
          setError("Something went wrong. Please try again.");
        });
    });
  }

  return (
    <div className="flex h-[100svh] items-center justify-center bg-[url('/abstract-background.jpg')] bg-cover bg-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 sm:px-0"
      >
        <div className="bg-login-card overflow-hidden rounded-lg shadow-xl backdrop-blur-md">
          <div className="p-4 sm:p-8">
            <h2 className="mb-4 sm:mb-6 text-center text-2xl sm:text-3xl font-bold">
              Bem-vindo ao EstudeAi
            </h2>
            <Form {...form}>
              <form
                className="space-y-4 sm:space-y-6"
                onSubmit={form.handleSubmit(submitForm)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="seu@email.com"
                          required
                          className="text-sm sm:text-base"
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="text-sm sm:text-base"
                            disabled={isPending}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                            disabled={isPending}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {success && (
                  <Alert variant="success" className="mb-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full text-sm sm:text-base"
                  disabled={isPending || !!success}
                >
                  {isPending ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                href={"/auth/reset-password"}
                className="text-primary text-xs sm:text-sm hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          <div className="bg-muted/50 px-4 sm:px-8 py-4 sm:py-6 text-center backdrop-blur-sm">
            <p className="text-muted-foreground text-xs sm:text-sm">
              Não tem uma conta?
              <Link
                href={"/auth/register"}
                className="text-primary font-medium hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
