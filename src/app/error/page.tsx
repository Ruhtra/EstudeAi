"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  function handleBackToLogin() {
    router.push("/login");
  }

  return (
    <Card className=" max-w-md mx-auto mt-12 text-center">
      <CardHeader className="p-4 ">
        <CardTitle>Ocorreu um erro</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0  space-y-4">
        <p className="m-0 p-0">
          Por favor, contate o suporte para mais informações.
        </p>
        <Button onClick={handleBackToLogin} variant="default" color="primary">
          Voltar para a página de login
        </Button>
      </CardContent>
    </Card>
  );
}
