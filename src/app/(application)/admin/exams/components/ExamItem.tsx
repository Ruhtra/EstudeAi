"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableCell } from "@/components/ui/table";
import { ExamActions } from "./ExamActions";
import type { ExamsDto } from "@/app/api/exams/route";
import { deleteExam, publishExam, unPublishExam } from "../_actions/exam";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";
import { cn } from "@/lib/utils";

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

  const togglePublish = async () => {
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
  const itemClasses = cn(
    "transition-opacity duration-200",
    isPending && "opacity-50 pointer-events-none"
  );

  if (isMobile) {
    return (
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <div className={itemClasses}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{exam.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{exam.year}</Badge>
                <Badge variant={exam.isComplete ? "default" : "secondary"}>
                  {exam.isComplete ? "Publicado" : "Não publicado"}
                </Badge>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isPending}>
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4">
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Posição:</span>
                <span>{exam.position}</span>
                <span className="text-muted-foreground">Instituto:</span>
                <span>{exam.instituteName}</span>
                <span className="text-muted-foreground">Banca:</span>
                <span>{exam.bankName}</span>
                <span className="text-muted-foreground">Nível:</span>
                <span>{exam.level}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/exams/${exam.id}/questions`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={isPending}
                >
                  Questões
                </Button>
              </Link>
              <Link href={`/admin/exams/${exam.id}/texts`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={isPending}
                >
                  Textos
                </Button>
              </Link>
              <ExamActions
                exam={exam}
                isComplete={exam.isComplete}
                handlePublish={togglePublish}
                handleDelete={handleDelete}
                isPending={isPending}
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <>
      <TableCell className={itemClasses}>{exam.name}</TableCell>
      <TableCell className={itemClasses}>{exam.position}</TableCell>
      <TableCell className={itemClasses}>
        <Badge variant="secondary">{exam.year}</Badge>
      </TableCell>
      <TableCell className={itemClasses}>{exam.instituteName}</TableCell>
      <TableCell className={itemClasses}>
        <Badge variant="outline">{exam.bankName}</Badge>
      </TableCell>
      <TableCell className={itemClasses}>
        <Badge>{exam.level}</Badge>
      </TableCell>
      <TableCell className={itemClasses}>
        <Badge variant={exam.isComplete ? "default" : "secondary"}>
          {exam.isComplete ? "Publicado" : "Não publicado"}
        </Badge>
      </TableCell>
      <TableCell className={itemClasses}>
        <div className="flex items-center gap-2">
          <Link href={`/admin/exams/${exam.id}/questions`}>
            <Button variant="outline" size="sm" disabled={isPending}>
              Questões
            </Button>
          </Link>
          <Link href={`/admin/exams/${exam.id}/texts`}>
            <Button variant="outline" size="sm" disabled={isPending}>
              Textos
            </Button>
          </Link>
        </div>
      </TableCell>
      <TableCell className={itemClasses}>
        <ExamActions
          exam={exam}
          isComplete={exam.isComplete}
          handlePublish={togglePublish}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </TableCell>
    </>
  );
}
