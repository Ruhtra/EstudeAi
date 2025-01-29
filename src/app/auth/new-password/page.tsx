"use client";

import { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPassword } from "@/actions/newPassword";
import type { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NewPasswordSchema } from "@/schemas/LoginSchema";

export default function NewPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);
  }, [searchParams]);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function submitForm(values: z.infer<typeof NewPasswordSchema>) {
    if (!token) return;

    setSuccess(null);
    setError(null);
    startTransition(async () => {
      newPassword(values, token)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            form.reset();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("Algo deu errado. Por favor, tente novamente.");
        });
    });
  }

  if (!token) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-[url('/abstract-background.jpg')] bg-cover bg-center">
        <div className="bg-login-card p-8 rounded-lg shadow-xl backdrop-blur-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Token ausente. Não é possível redefinir a senha.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
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
              Nova Senha
            </h2>
            {!success ? (
              <>
                <p className="mb-6 text-center text-sm sm:text-base text-muted-foreground">
                  Por favor, insira sua nova senha.
                </p>
                <Form {...form}>
                  <form
                    className="space-y-4 sm:space-y-6"
                    onSubmit={form.handleSubmit(submitForm)}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Nova Senha
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              required
                              className="text-sm sm:text-base"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">
                            Confirmar Nova Senha
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              required
                              className="text-sm sm:text-base"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      disabled={isPending}
                    >
                      {isPending ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert variant="success" className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
                <Link href="/auth/login">
                  <Button className="w-full text-sm sm:text-base">
                    Voltar para o Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
          {!success && (
            <div className="bg-muted/50 px-4 sm:px-8 py-4 sm:py-6 text-center backdrop-blur-sm">
              <Link
                href="/auth/login"
                className="text-primary text-xs sm:text-sm hover:underline inline-flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar para o login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
