"use client";

import type { QuestionsDto } from "@/app/api/questions/route";
import type React from "react";
// import { useState } from "react";
// import { CreateQuestionDialog } from "../_components/CreateQuestionDialog";
import {
  Actions,
  ActionsDelete,
  ActionsEdit,
} from "@/components/personalized/Actions";
import { QuestionsSheet } from "../_components/CreateAlternative/QuestionSheet";
import { useState } from "react";

interface QuestionActionsProps {
  question: QuestionsDto;
  idExam: string;
  handleDelete: () => Promise<void>;
  isPending: boolean;
}

export function QuestionActions({
  question,
  idExam,
  handleDelete,
  isPending,
}: QuestionActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    setIsEditOpen(true);
  };
  return (
    <>
      <QuestionsSheet
        idQuestions={question.id}
        idExam={idExam}
        onOpenChange={setIsEditOpen}
        open={isEditOpen}
      />

      <Actions isPending={isPending}>
        <ActionsEdit handleEdit={handleEdit} isPending={isPending} />
        <ActionsDelete handleDelete={handleDelete} isPending={isPending} />
      </Actions>
    </>
  );
}
