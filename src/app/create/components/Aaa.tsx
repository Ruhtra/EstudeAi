"use client";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { deleteContact } from "./actions";

export function Cc({ id, email }: { id: string; email: string }) {
  const { isPending: pendingDelete, execute: Delete } =
    useServerAction(deleteContact);
  return (
    <div key={id} className="flex justify-between">
      {email}
      <Button disabled={pendingDelete} onClick={() => Delete({ email: email })}>
        Delete
      </Button>
    </div>
  );
}
