"use client";

import type { ExamsDto } from "@/app/api/exams/route";
import type React from "react";
import { useState } from "react";
import { CreateExamDialog } from "../_components/CreateExamDialog";
import {
  Actions,
  ActionsDelete,
  ActionsEdit,
  ActionsPublish,
} from "@/components/personalized/Actions";

interface ExamActionsProps {
  exam: ExamsDto;
  isComplete: boolean;
  handlePublish: () => Promise<void>;
  handleDelete: () => Promise<void>;
  isPending: boolean;
}

export function ExamActions({
  exam,
  handlePublish,
  handleDelete,
  isPending,
}: ExamActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    setIsEditOpen(true);
  };
  return (
    <>
      <CreateExamDialog
        idExam={exam.id}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <Actions isPending={isPending}>
        <ActionsEdit handleEdit={handleEdit} isPending={isPending} />
        <ActionsPublish
          handlePublish={handlePublish}
          isComplete={exam.isComplete}
          isPending={isPending}
        />
        <ActionsDelete
          handleDelete={handleDelete}
          isPending={isPending}
          message={`Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita e apagará as (${exam.totalQuestions}) questões e os (${exam.totalTexts}) textos vinculados.`}
        />
      </Actions>
    </>
  );
}
