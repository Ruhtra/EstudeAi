"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { type UserDTO } from "./_actions/user";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { UserList } from "./components/UserList";
import { CreateUserDialog } from "./_components/CreateUserDialog";

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

  const LoadingSkeleton = () => (
    <>
      {/* Mobile and Tablet Skeleton */}
      <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-card rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );

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

        {isPending ? <LoadingSkeleton /> : <UserList users={filteredUsers} />}
      </div>
    </>
  );
}
