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
import type { QuestionsDto } from "@/app/api/questions/route";
import { QuestionCreateSkeleton } from "./QuestionCreateSkeleton";

interface QuestionsSheetProps {
  idExam: string;
  idQuestions?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type FormValues = z.infer<typeof questionSchema>;

// Helper function to convert a URL to a File object
async function urlToFile(
  url: string,
  filename = "image.jpg"
): Promise<File | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error converting URL to File:", error);
    return null;
  }
}

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues: Record<any, any> = {
    linkedTexts: [],
    statement: "", // Pode ser removido também
    discipline: "",
    alternatives: [
      { content: "", contentType: "text", isCorrect: false },
      { content: "", contentType: "text", isCorrect: false },
    ],
  };

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (questionData) {
      // Set basic form values
      form.setValue(
        "linkedTexts",
        questionData.texts.map((e) => e.id)
      );
      form.setValue("statement", questionData.statement);
      form.setValue("discipline", questionData.discipline);

      // Process alternatives with async operations for image content
      const processAlternatives = async () => {
        const processedAlternatives = await Promise.all(
          questionData.alternatives.map(async (alt) => {
            const result = {
              id: alt.id,
              isCorrect: alt.isCorrect,
              contentType: alt.contentType as "text" | "image",
              content: alt.content,
            };

            // If it's an image, convert the URL to a File object
            if (
              alt.contentType === "image" &&
              typeof alt.content === "string"
            ) {
              try {
                // For data URLs, we can use them directly
                if (alt.content.startsWith("data:")) {
                  // Use type assertion to tell TypeScript this is valid
                  return result as unknown;
                }

                // For HTTP URLs, convert to File
                if (alt.content.startsWith("http")) {
                  const file = await urlToFile(alt.content);
                  if (file) {
                    return {
                      ...result,
                      content: file,
                    };
                  }
                }
              } catch (error) {
                console.error("Error processing image alternative:", error);
              }
            }

            // Return the result with type assertion if needed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return result as any;
          })
        );

        // Set the processed alternatives
        form.setValue("alternatives", processedAlternatives);

        // Force a re-render
        form.trigger();
      };

      processAlternatives();
    }
  }, [questionData, form]);

  const {
    disciplines,
    texts,
    isError,
    isLoading: isLoadingOptions,
  } = useQuestionOptions(idExam);

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
          <QuestionCreateSkeleton />
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
                  texts={texts.map((e) => ({
                    id: e.id,
                    label: "Texto " + e.number.toString(),
                  }))}
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
