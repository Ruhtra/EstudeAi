"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { type UserDTO } from "./_actions/user";
import { useQuery } from "@tanstack/react-query";
import { UserList } from "./components/UserList";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import { UserSkeleton } from "./components/UserSkeleton";

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isPending, data } = useQuery<UserDTO[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return await response.json();
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = data
    ? data.filter((user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-3">Usuários</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <Input
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </div>

        {isPending ? <UserSkeleton /> : <UserList users={filteredUsers} />}
      </div>
    </>
  );
}
