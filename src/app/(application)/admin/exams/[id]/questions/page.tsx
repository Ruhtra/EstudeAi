"use client";
// import { useParams } from "next/navigation";
import { QuestionsDto } from "@/app/api/questions/route";
import { useQuery } from "@tanstack/react-query";
import { QuestionsHeader } from "./components/QuestionHeader";
import { QuestionSkeleton } from "./components/QuestionSkeleton";
import { QuestionsList } from "./components/QuestionList";

export default function QuestionsExamPage() {
  const { isPending, data } = useQuery<QuestionsDto[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await fetch("/api/questions");
      return await response.json();
    },
  });

  // const { id: examId } = useParams<{ id: string }>();

  return (
    <>
      <div className="container mx-auto">
        <h1 className="bg-red-500">
          ATENÇÃO! AINDA ESTAMOS IMPORTANTE ESSA TELA
        </h1>
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
