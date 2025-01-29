import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">Página em Desenvolvimento</h1>
        <p className="mt-4">
          Estamos trabalhando para trazer novidades em breve. Por favor, volte
          mais tarde.
        </p>
        <div className="mt-4">
          <Link href="/">
            <Button>Voltar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
