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

interface QuestionActionsProps {
  question: QuestionsDto;
  handleDelete: () => Promise<void>;
  isPending: boolean;
}

export function QuestionActions({
  // question,
  handleDelete,
  isPending,
}: QuestionActionsProps) {
  // const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    // setIsEditOpen(true);
  };
  return (
    <>
      {/* <CreateQuestionDialog idQuestion={question.id} open={isEditOpen} onOpenChange={setIsEditOpen} /> */}

      <Actions isPending={isPending}>
        <ActionsEdit handleEdit={handleEdit} isPending={isPending} />
        <ActionsDelete handleDelete={handleDelete} isPending={isPending} />
      </Actions>
    </>
  );
}
