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
} from "../ui/alert-dialog";

interface ExamActionsProps {
  isPending: boolean;
  children: ReactNode;
}

export function Actions({ isPending, children }: ExamActionsProps) {
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
  handleDelete: () => void;
  isPending: boolean;
  message?: string;
}
export function ActionsDelete({
  handleDelete,
  isPending,
  message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
}: ActionsDeleteProps) {
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
            onClick={handleDelete}
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
  isPending: boolean;
  isComplete: boolean;
}
export function ActionsPublish({
  handlePublish,
  isPending,
  isComplete,
}: ActionsPublishProps) {
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
  isPending: boolean;
}
export function ActionsEdit({ handleEdit, isPending }: ActionsEditProps) {
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
