"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { QuestionForm } from "./QuestionForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { questionSchema } from "../../_actions/QuestionSchema";
import { toast } from "sonner";
import { createQuestion, updateQuestion } from "../../_actions/question";
import { useEffect, useTransition } from "react";
import { queryClient } from "@/lib/queryCLient";
import { useQuestionOptions } from "../../_queries/QuestionQueries";
import { useQuery } from "@tanstack/react-query";
import { QuestionsDto } from "@/app/api/questions/route";
interface QuestionsSheetProps {
  idExam: string;
  idQuestions?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type FormValues = z.infer<typeof questionSchema>;

export function QuestionsSheet({
  idExam,
  idQuestions,
  onOpenChange,
  open,
}: QuestionsSheetProps) {
  const [isPending, startTransition] = useTransition();

  const { data: questionData, isLoading } = useQuery({
    queryKey: ["question", idQuestions],
    queryFn: () => fetchQuestion(idQuestions),
    enabled: !!idQuestions && open,
    refetchOnMount: true,
  });

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      number: "",
      linkedTexts: [],
      statement: "", // Pode ser removido também
      discipline: "",
      alternatives: [
        { content: "", contentType: "text", isCorrect: false },
        { content: "", contentType: "text", isCorrect: false },
      ],
    },
  });

  useEffect(() => {
    if (questionData) {
      Object.entries(questionData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });

      form.setValue(
        "linkedTexts",
        questionData.texts.map((e) => e.number)
      );
      form.setValue("statement", questionData.statement);

      console.log(questionData.statement);

      form.setValue(
        "alternatives",
        questionData.alternatives.map((e) => ({
          id: e.id,
          content: e.content,
          contentType: e.contentType,
          isCorrect: e.isCorrect,
        }))
      );
    }
  }, [questionData, form]);

  const {
    disciplines,
    texts,
    isError,
    isLoading: isLoadingOptions,
  } = useQuestionOptions();

  if (isError) {
    return <div>Error loading options. Please try again later.</div>;
  }

  function onSubmit(values: z.infer<typeof questionSchema>) {
    startTransition(async () => {
      try {
        if (idQuestions) {
          const data = await updateQuestion(idQuestions, values);
          if (data.error) {
            toast(data.error);
            return;
          }
          if (data.success) {
            await queryClient.refetchQueries({
              queryKey: ["questions", idExam],
            });
            queryClient.removeQueries({
              queryKey: ["question", idQuestions],
            });
            onOpenChange(false);
            form.reset();
            toast("Question atualizado com sucesso");
          }
        } else {
          const data = await createQuestion(idExam, values);
          if (data.error) toast(data.error);
          if (data.success) {
            onOpenChange(false);
            form.reset();
            toast("Questions criado com sucesso");
            queryClient.refetchQueries({
              queryKey: ["questions", idExam],
            });
          }
        }
      } catch {
        toast("Algo deu errado, contate o suporte!");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl p-4 overflow-y-auto">
        {isLoadingOptions || isLoading ? (
          <>loading</>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <SheetHeader>
                <SheetTitle className="text-2xl font-semibold">
                  Nova Questão
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <QuestionForm
                  disciplines={disciplines.map((e) => e.name)}
                  texts={texts.map((e) => e.number)}
                  control={form.control}
                  errors={form.formState.errors}
                />
              </div>
              <SheetFooter>
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  {idQuestions ? "Atualizar Questão" : "Criar Questão"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}

async function fetchQuestion(
  id: string | undefined
): Promise<QuestionsDto | null> {
  if (id) {
    const response = await fetch(`/api/questions/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }
    return response.json();
  }
  return null;
}
