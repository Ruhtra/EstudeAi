"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";

export default function StudentAreaPage() {
  const user = useCurrentUser();

  return (
    <div className="min-h-full flex flex-col items-center justify-center ">
      <Card className="w-full max-w-md p-4 rounded-2xl shadow-lg">
        <CardContent className="p-2">
          <h1 className="text-2xl font-bold mb-4">Área do Estudante</h1>
          <p className="text-gray-600 mb-6">
            Esta área está em desenvolvimento. No momento, não há informações
            disponíveis.
          </p>
          {user && (
            <div className="mb-6">
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}
          <Button variant="destructive" className="w-full" onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
