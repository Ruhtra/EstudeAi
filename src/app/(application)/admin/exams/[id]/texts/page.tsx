"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { TextsDto } from "@/app/api/texts/route";
import { useQuery } from "@tanstack/react-query";
import { TextList } from "./components/TextList";
import { CreateTextDialog } from "./_components/CreateTextDialog";

export default function TextsExamPage() {
  const { id: idExam } = useParams<{ id: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isPending, data } = useQuery<TextsDto[]>({
    queryKey: ["texts", idExam],
    queryFn: async () => {
      const response = await fetch("/api/texts?examId=" + idExam);
      return await response.json();
    },
  });

  return (
    <>
      <CreateTextDialog
        idExam={idExam}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <div className="container mx-auto">
        <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Textos do Exame {idExam}
          </h1>
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Texto
          </Button>
        </div>
        {isPending ? <p>loading</p> : <TextList texts={data!} />}
      </div>
    </>
  );
}
