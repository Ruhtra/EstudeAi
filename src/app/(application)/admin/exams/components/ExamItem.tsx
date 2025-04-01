"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamActions } from "./ExamActions";
import type { ExamsDto } from "@/app/api/exams/route";
import { deleteExam, publishExam, unPublishExam } from "../_actions/exam";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";
import { FileText, HelpCircle } from "lucide-react";
import {
  ItemMobile,
  ItemMobileHeader,
  ItemMobileHeaderTitle,
  ItemMobileHeaderBadges,
  ItemMobileHeaderOptions,
  ItemMobileContent,
  ItemMobileContentData,
  ItemMobileTrigger,
  ItemMobileContentOptions,
  ItemDesktop,
  ItemDesktopCell,
} from "../../../../../components/personalized/Item";

interface ExamItemProps {
  exam: ExamsDto;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile: boolean;
}

export function ExamItem({
  exam,
  isExpanded,
  onToggleExpand,
  isMobile,
}: ExamItemProps) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = async () => {
    startTransition(async () => {
      const action = exam.isComplete ? unPublishExam : publishExam;
      const successMessage = exam.isComplete
        ? "Exame despublicado com sucesso"
        : "Exame publicado com sucesso";

      try {
        const data = await action(exam.id);
        if (data.error) {
          toast(data.error);
        } else if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["exams"],
          });
          toast(successMessage);
        }
      } catch {
        toast("Algo deu errado, informe o suporte!");
      }
    });
  };
  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const data = await deleteExam(exam.id);
        if (data.error) {
          toast(data.error);
        } else if (data.success) {
          await queryClient.refetchQueries({
            queryKey: ["exams"],
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
        <ItemMobileHeader>
          <ItemMobileHeaderTitle name={exam.name}>
            <ItemMobileHeaderBadges>
              <Badge variant="secondary">{exam.year}</Badge>
              <Badge
                variant={exam.isComplete ? "default" : "destructive"}
                className="text-nowrap"
              >
                {exam.isComplete ? "Publicado" : "Não publicado"}
              </Badge>
            </ItemMobileHeaderBadges>
          </ItemMobileHeaderTitle>
          <ItemMobileHeaderOptions>
            <ExamActions
              exam={exam}
              isComplete={exam.isComplete}
              handlePublish={handlePublish}
              handleDelete={handleDelete}
              isPending={isPending}
            />
            <ItemMobileTrigger isPending={isPending} isExpanded={isExpanded} />
          </ItemMobileHeaderOptions>
        </ItemMobileHeader>
        <ItemMobileContent>
          <ItemMobileContentData>
            <span className="text-muted-foreground">Instituto:</span>
            <span>{exam.instituteName}</span>
            <span className="text-muted-foreground">Banca:</span>
            <span>{exam.bankName}</span>
            <span className="text-muted-foreground">Nível:</span>
            <span>{exam.level}</span>
          </ItemMobileContentData>
          <ItemMobileContentOptions>
            <Link href={`/admin/exams/${exam.id}/texts`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1"
                disabled={isPending}
              >
                <FileText size={14} />
                <span>Textos</span>
                <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                  {exam.totalTexts}
                </div>
              </Button>
            </Link>
            <Link href={`/admin/exams/${exam.id}/questions`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1"
                disabled={isPending}
              >
                <HelpCircle size={14} />
                <span>Questões</span>
                <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                  {exam.totalQuestions}
                </div>
              </Button>
            </Link>
          </ItemMobileContentOptions>
        </ItemMobileContent>
      </ItemMobile>
    );
  }

  return (
    <ItemDesktop>
      <ItemDesktopCell isPending={isPending}>{exam.name}</ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <Badge variant="secondary">{exam.year}</Badge>
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        {exam.instituteName}
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <Badge variant="outline">{exam.bankName}</Badge>
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <Badge>{exam.level}</Badge>
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <Badge
          variant={exam.isComplete ? "default" : "destructive"}
          className="text-nowrap"
        >
          {exam.isComplete ? "Publicado" : "Não publicado"}
        </Badge>
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <div className="flex items-center gap-2">
          <Link href={`/admin/exams/${exam.id}/texts`}>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className="flex items-center gap-1"
            >
              <FileText size={14} />
              <span>Textos</span>
              <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                {exam.totalTexts}
              </div>
            </Button>
          </Link>
          <Link href={`/admin/exams/${exam.id}/questions`}>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className="flex items-center gap-1"
            >
              <HelpCircle size={14} />
              <span>Questões</span>
              <div className="flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold">
                {exam.totalQuestions}
              </div>
            </Button>
          </Link>
        </div>
      </ItemDesktopCell>
      <ItemDesktopCell isPending={isPending}>
        <ExamActions
          exam={exam}
          isComplete={exam.isComplete}
          handlePublish={handlePublish}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </ItemDesktopCell>
    </ItemDesktop>
  );
}
