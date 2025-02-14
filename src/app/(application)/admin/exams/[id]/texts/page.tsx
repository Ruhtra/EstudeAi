"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TextsDto } from "@/app/api/texts/route";
import { useQuery } from "@tanstack/react-query";
import { CreateTextDialog } from "./_components/CreateTextDialog";
import { TextSkeleton } from "./components/TextSkeleton";
import { TextList } from "./components/TextList";
import { TextHeader } from "./components/TextHeader";

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
        <TextHeader />
        {isPending ? <TextSkeleton /> : <TextList texts={data!} />}
      </div>
    </>
  );
}
