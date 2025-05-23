"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { QuestionActions } from "./QuestionActions";
import type { QuestionsDto } from "@/app/api/questions/route";
import {
  ItemMobile,
  ItemMobileHeader,
  ItemMobileHeaderTitle,
  ItemMobileHeaderBadges,
  ItemMobileHeaderOptions,
  ItemMobileContent,
  ItemMobileContentData,
  ItemMobileTrigger,
  ItemDesktop,
  ItemDesktopCell,
} from "@/components/personalized/Item";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { deleteQuestion } from "../_actions/question";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";
import { useParams } from "next/navigation";

interface QuestionItemProps {
  question: QuestionsDto;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile: boolean;
}

export function QuestionItem({
  question,
  isExpanded,
  onToggleExpand,
  isMobile,
}: QuestionItemProps) {
  const [isPending, startTransition] = useTransition();
  const { id: idExam } = useParams<{ id: string }>();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const data = await deleteQuestion(question.id);
        if (data.error) {
          toast(data.error);
        } else if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["disciplines"],
          });
          await queryClient.refetchQueries({
            queryKey: ["questions"],
          });

          toast(data.success);
        }
      } catch {
        toast("Algo deu errado, informe o suporte!");
      }
    });
  };

  if (isMobile) {
    return (
      <ItemMobile
        isPending={isPending}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      >
        <div className="flex flex-col w-full">
          <ItemMobileHeader>
            <ItemMobileHeaderTitle name={"Questão " + question.number}>
              <ItemMobileHeaderBadges>
                <Badge>{question.discipline}</Badge>
              </ItemMobileHeaderBadges>
              <p
                className="mb-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: question.statement }}
              ></p>
            </ItemMobileHeaderTitle>
            <ItemMobileHeaderOptions>
              <QuestionActions
                idExam={idExam}
                question={question}
                handleDelete={handleDelete}
                isPending={isPending}
              />
            </ItemMobileHeaderOptions>
          </ItemMobileHeader>
          <ItemMobileTrigger isPending={isPending} isExpanded={isExpanded}>
            <Button
              variant="outline"
              size="sm"
              className="w-full self-center mt-4 max-w-xs text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Ocultar Alternativas
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Mostrar Alternativas
                </>
              )}
            </Button>
          </ItemMobileTrigger>
        </div>
        <ItemMobileContent>
          <ItemMobileContentData>
            {question.alternatives.map((alt) => (
              <div
                key={alt.id}
                className={`rounded-md p-2 text-xs leading-relaxed ${
                  alt.isCorrect
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
                dangerouslySetInnerHTML={{ __html: alt.content ?? "" }}
              />
            ))}
          </ItemMobileContentData>
        </ItemMobileContent>
      </ItemMobile>
    );
  }

  return (
    <ItemDesktop>
      <ItemDesktopCell isPending={isPending}>
        Questão {question.number}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <span dangerouslySetInnerHTML={{ __html: question.statement }} />
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <Badge variant="secondary">{question.discipline}</Badge>
      </ItemDesktopCell>

      <ItemDesktopCell isPending={isPending}>
        <QuestionActions
          idExam={idExam}
          question={question}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </ItemDesktopCell>
    </ItemDesktop>
  );
}
