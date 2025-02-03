"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCard } from "./_components/UserCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { UserRole } from "@prisma/client";
import { type UserDTO, deleteUser } from "./_actions/user";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { queryClient } from "@/lib/queryCLient";

export default function UsersPage() {
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

  const handleDelete = (id: string) => {
    deleteUser(id).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    });
  };

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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-3">Usuários</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <Input
          placeholder="Buscar usuários..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <CreateUserDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </CreateUserDialog>
      </div>

      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Mobile and Tablet View */}
          <div className="md:hidden">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
          </div>

          {/* Desktop View */}
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
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl || "/placeholder.svg"}
                            alt={`Foto de ${user.name}`}
                            className="w-10 h-10 rounded-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xl">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{UserRole[user.role]}</TableCell>
                      <TableCell className="text-nowrap">
                        {user.phone.replace(
                          /(\d{2})(\d{1})(\d{4})(\d{4})/,
                          "($1) $2 $3-$4"
                        )}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {user.cpf?.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <CreateUserDialog idUser={user.id}>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Editar
                              </DropdownMenuItem>
                            </CreateUserDialog>
                            <DropdownMenuItem
                              onSelect={() => handleDelete(user.id)}
                              className="text-red-600"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
