"use client";
// import { useParams } from "next/navigation";
import { QuestionsDto } from "@/app/api/questions/route";
import { useQuery } from "@tanstack/react-query";
import { QuestionsHeader } from "./components/QuestionHeader";
import { QuestionSkeleton } from "./components/QuestionSkeleton";
import { QuestionsList } from "./components/QuestionList";
import { useParams } from "next/navigation";
import { ExamsDto } from "@/app/api/exams/route";
import { QuestionHeaderSkeleton } from "./components/QuestionHeaderSkeleton";

export default function QuestionsExamPage() {
  const { id: examId } = useParams<{ id: string }>();
  const { isPending, data } = useQuery<QuestionsDto[]>({
    queryKey: ["questions", examId],
    queryFn: async () => {
      const response = await fetch("/api/questions");
      return await response.json();
    },
  });

  const { data: examData, isPending: isPendingExam } = useQuery<ExamsDto>({
    queryKey: ["exam", examId],
    queryFn: async () => {
      const response = await fetch(`/api/exams/${examId}`);
      return response.json();
    },
  });

  // Combined loading state
  const isLoading = isPending || isPendingExam;

  return (
    <>
      <div className="container mx-auto">
        {isLoading ? (
          <>
            <QuestionHeaderSkeleton />
            <QuestionSkeleton />
          </>
        ) : (
          <>
            <QuestionsHeader name={examData!.name} />
            <QuestionsList questions={data ?? []} />
          </>
        )}
      </div>
    </>
  );
}
