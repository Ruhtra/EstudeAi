"use client";

import type React from "react";
import { useState } from "react";
import {
  Actions,
  ActionsDelete,
  ActionsEdit,
} from "@/components/personalized/Actions";
import { UserDTO } from "../_actions/user";
import { CreateUserDialog } from "../_components/CreateUserDialog";

interface UserActionsProps {
  user: UserDTO;
  handleDelete: () => Promise<void>;
  isPending: boolean;
}

export function UserActions({
  user,
  handleDelete,
  isPending,
}: UserActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = () => {
    setIsEditOpen(true);
  };
  return (
    <>
      <CreateUserDialog
        idUser={user.id}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <Actions isPending={isPending}>
        <ActionsEdit handleEdit={handleEdit} isPending={isPending} />
        {/* <ActionsPublish handlePublish={handlePublish} isComplete={User.isComplete} isPending={isPending} /> */}
        <ActionsDelete handleDelete={handleDelete} isPending={isPending} />
      </Actions>
    </>
  );
}
