"use client";

import type React from "react";
import { useState } from "react";
import {
  Actions,
  ActionsDelete,
  ActionsEdit,
} from "@/components/personalized/Actions";
import { TextsDto } from "@/app/api/texts/route";
import { CreateTextDialog } from "../_components/CreateTextDialog";
// import { CreateTextDialog } from "../_components/CreateTextDialog";

interface TextActionsProps {
  text: TextsDto;
  handleDelete: () => Promise<void>;
  isPending: boolean;
  idExam: string;
}

export function TextActions({
  text,
  handleDelete,
  idExam,
  isPending,
}: TextActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    setIsEditOpen(true);
  };
  return (
    <>
      <CreateTextDialog
        idText={text.id}
        idExam={idExam}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <Actions isPending={isPending}>
        <ActionsEdit handleEdit={handleEdit} isPending={isPending} />
        {/* <ActionsPublish handlePublish={handlePublish} isComplete={Text.isComplete} isPending={isPending} /> */}
        <ActionsDelete handleDelete={handleDelete} isPending={isPending} />
      </Actions>
    </>
  );
}
