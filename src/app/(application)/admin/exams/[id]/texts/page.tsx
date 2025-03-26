"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { TextsDto } from "@/app/api/texts/route";
import { useQuery } from "@tanstack/react-query";
import { CreateTextDialog } from "./_components/CreateTextDialog";
import { TextSkeleton } from "./components/TextSkeleton";
import { TextList } from "./components/TextList";
import { TextHeader } from "./components/TextHeader";
import { TextHeaderSkeleton } from "./components/TextHeaderSkeleton";
import type { ExamsDto } from "@/app/api/exams/route";

export default function TextsExamPage() {
  const { id: idExam } = useParams<{ id: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch texts data
  const { data: textsData, isPending: isTextsPending } = useQuery<TextsDto[]>({
    queryKey: ["texts", idExam],
    queryFn: async () => {
      const response = await fetch("/api/texts?examId=" + idExam);
      return await response.json();
    },
  });

  // Fetch exam data with longer staleTime to avoid unnecessary refetches
  const { data: examData, isPending: isExamPending } = useQuery<ExamsDto>({
    queryKey: ["exam", idExam],
    queryFn: async () => {
      const response = await fetch(`/api/exams/${idExam}`);
      return response.json();
    },
  });

  // Combined loading state
  const isLoading = isTextsPending || isExamPending;

  return (
    <>
      <CreateTextDialog
        idExam={idExam}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <div className="container mx-auto">
        {isLoading ? (
          <>
            <TextHeaderSkeleton />
            <TextSkeleton />
          </>
        ) : (
          <>
            <TextHeader name={examData!.name} />
            <TextList texts={textsData!} />
          </>
        )}
      </div>
    </>
  );
}
