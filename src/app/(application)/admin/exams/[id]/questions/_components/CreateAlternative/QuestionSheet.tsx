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
import { createQuestion } from "../../_actions/question";
import { useTransition } from "react";
import { queryClient } from "@/lib/queryCLient";
import { useQuestionOptions } from "../../_queries/QuestionQueries";
interface QuestionsSheetProps {
  idExam: string;
  idQuestions?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function QuestionsSheet({
  idExam,
  idQuestions,
  onOpenChange,
  open,
}: QuestionsSheetProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      number: 0,
      linkedTexts: [],
      statement: "",
      discipline: "",
      alternatives: [
        { content: "", contentType: "text", isCorrect: false },
        { content: "", contentType: "text", isCorrect: false },
      ],
    },
  });

  const {
    disciplines,
    texts,
    isError,
    isLoading: isLoadingOptions,
  } = useQuestionOptions();

  if (isError) {
    return <div>Error loading options. Please try again later.</div>;
  }
  if (isLoadingOptions) <>'skelton'</>;

  function onSubmit(values: z.infer<typeof questionSchema>) {
    startTransition(async () => {
      try {
        if (idQuestions) {
          // const data = await updateQuestion(idExam, values);
          // if (data.error) {
          //   toast(data.error);
          //   return;
          // }
          // if (data.success) {
          //   await queryClient.refetchQueries({
          //     queryKey: ["questions", idExam],
          //   });
          //   queryClient.removeQueries({
          //     queryKey: ["question", idQuestions],
          //   });
          //   onOpenChange(false);
          //   form.reset();
          //   toast("Question atualizado com sucesso");
          // }
        } else {
          console.log(values);

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
        {isLoadingOptions ? (
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
                <Button type="submit" className="w-full sm:w-auto">
                  Criar Questão
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
