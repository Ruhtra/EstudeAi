"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { CreateExamDialog } from "../_components/CreateExamDialog";
import type { ExamsDto } from "@/app/api/exams/route";
import type React from "react"; // Added import for React

interface ExamActionsProps {
  exam: ExamsDto;
  isComplete: boolean;
  togglePublish: () => Promise<void>;
  handleDelete: () => Promise<void>;
  isPending: boolean;
}

export function ExamActions({
  exam,
  isComplete,
  togglePublish,
  handleDelete,
  isPending,
}: ExamActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTogglePublish = async (e: Event) => {
    e.preventDefault();
    await togglePublish();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CreateExamDialog idExam={exam.id}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        </CreateExamDialog>
        <DropdownMenuItem onSelect={handleTogglePublish} disabled={isPending}>
          {isComplete ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              {isPending ? "Despublicando..." : "Despublicar"}
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              {isPending ? "Publicando..." : "Publicar"}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e: Event) => {
            e.preventDefault();
            handleDelete();
          }}
          className="text-red-600"
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
