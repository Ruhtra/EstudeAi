"use client";

import type React from "react";
import { useState } from "react";
import { CreateTextDialog } from "../_components/CreateTextDialog";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function TextHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { id: idExam } = useParams<{ id: string }>();

  return (
    <>
      <CreateTextDialog
        idExam={idExam}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Textos do Exame {idExam}
        </h1>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Texto
        </Button>
      </div>
    </>
  );
}
