"use client"
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "../actions";
import UserDialog from "./UserDialog";

export function Actionsbtns({id}: {id: string}) {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const deleteUserClick = async (id: string) => {
        setLoading(true);
        startTransition(async () => {
            try {
                await deleteUser(id);
            } catch (err) {
                console.error("Failed to delete user:", err);
            } finally {
                setLoading(false);
            }
        });
    };

    return <>
        <UserDialog
              userId={id}
              trigger={<Button variant="outline">Edit</Button>}
            />
            <Button
              variant="destructive"
              onClick={() => deleteUserClick(id)}
              disabled={loading || isPending}
            >
              {loading || isPending ? "Deleting..." : "Delete"}
            </Button>
    </>
}