"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold ">404 - Página não encontrada</h1>
      <p className="mt-4 text-lg ">
        Não foi possível localizar a página que você está procurando.
      </p>
      <Button className="mt-6" onClick={handleGoHome}>
        Retornar para a página principal
      </Button>
    </div>
  );
}
