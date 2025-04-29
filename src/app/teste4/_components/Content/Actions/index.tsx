"use client";

import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import type React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useContentContext } from "../../ComponentContext";
import { useIsMutating } from "@tanstack/react-query";
import { useUserContext } from "@/app/teste4/UserMutationProvider";

interface ExamActionsProps {
  children: ReactNode;
}

function Actions({ children }: ExamActionsProps) {
  const a = useIsMutating({
    mutationKey: ["delete", "user", "1"],
  });
  let isPending = a > 0;
  // const { useDeleteMutation } = useContentContext()
  // const isPending = (deleteMutation?.isPending) || false;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{children}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface ActionsDeleteProps {
  message?: string;
}
function ActionsDelete({
  message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
}: ActionsDeleteProps) {
  const userContext = useUserContext();
  const { mutate, isPending } = userContext.useDeleteMutation("1");

  // const a = useIsMutating({
  //   mutationKey: ["delete", "user", "1"],
  // });
  // let isPending = a > 0;

  // const { useDeleteMutation } = useContentContext();
  // const isPending = useDeleteMutation?.isPending || false;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          className="text-red-600"
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ActionsPublishProps {
  handlePublish: () => void;
  isComplete: boolean;
}
function ActionsPublish({ handlePublish, isComplete }: ActionsPublishProps) {
  const a = useIsMutating({
    mutationKey: ["delete", "user", "1"],
  });
  let isPending = a > 0;
  // const { deleteMutation } = useContentContext()
  // const isPending = (deleteMutation?.isPending) || false;

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        handlePublish();
      }}
      disabled={isPending}
    >
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
  );
}

interface ActionsEditProps {
  handleEdit: () => void;
}
function ActionsEdit({ handleEdit }: ActionsEditProps) {
  const a = useIsMutating({
    mutationKey: ["delete", "user", "1"],
  });
  let isPending = a > 0;

  // const { deleteMutation } = useContentContext()
  // const isPending = (deleteMutation?.isPending) || false;

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        handleEdit();
      }}
      disabled={isPending}
    >
      <Pencil className="mr-2 h-4 w-4" />
      Editar
    </DropdownMenuItem>
  );
}

export const ContentActions = {
  Root: Actions,
  Delete: ActionsDelete,
  Publish: ActionsPublish,
  Edit: ActionsEdit,
};
