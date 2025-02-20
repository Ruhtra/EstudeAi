"use client";
// import { useParams } from "next/navigation";
import { QuestionsDto } from "@/app/api/questions/route";
import { useQuery } from "@tanstack/react-query";
import { QuestionsHeader } from "./components/QuestionHeader";
import { QuestionSkeleton } from "./components/QuestionSkeleton";
import { QuestionsList } from "./components/QuestionList";
import { useParams } from "next/navigation";

export default function QuestionsExamPage() {
  const { id: examId } = useParams<{ id: string }>();
  const { isPending, data } = useQuery<QuestionsDto[]>({
    queryKey: ["questions", examId],
    queryFn: async () => {
      const response = await fetch("/api/questions");
      return await response.json();
    },
  });

  return (
    <>
      <div className="container mx-auto">
        <QuestionsHeader />
        {isPending ? (
          <QuestionSkeleton />
        ) : (
          <QuestionsList questions={data ?? []} />
        )}
      </div>
    </>
  );
}
