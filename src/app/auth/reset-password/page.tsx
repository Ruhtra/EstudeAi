"use client";

import { useState, useTransition } from "react";
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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/actions/resetPassword";
import type { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { ResetSchema } from "@/schemas/LoginSchema";

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function submitForm(values: z.infer<typeof ResetSchema>) {
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      resetPassword(values)
        .then((data) => {
          if (data.error) {
            form.reset();
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
              Redefinir Senha
            </h2>
            {!success ? (
              <>
                <p className="mb-6 text-center text-sm sm:text-base text-muted-foreground">
                  Insira seu e-mail e enviaremos instruções para redefinir sua
                  senha.
                </p>
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
                      {isPending
                        ? "Enviando..."
                        : "Enviar e-mail de redefinição"}
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
                <p className="mb-6 text-center text-sm sm:text-base text-muted-foreground">
                  Verifique seu E-mail
                </p>
                <Link href="/">
                  <Button className="w-full text-sm sm:text-base">
                    Voltar para o Início
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
