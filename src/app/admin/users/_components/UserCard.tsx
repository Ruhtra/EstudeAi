import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserDTO } from "../_actions/user";
import Image from "next/image";
import { CreateUserDialog } from "./CreateUserDialog";

interface UserCardProps {
  user: UserDTO;
  onDelete: (id: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <CreateUserDialog idUser={user.id}>
      <Card className="mb-4 shadow-sm cursor-pointer">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            {user.image ? (
              <Image
                src={user.image || "/placeholder.svg"}
                alt={`Foto de ${user.name}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <CreateUserDialog idUser={user.id}>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                </CreateUserDialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(user.id)}
                  className="text-destructive"
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="p-4 space-y-2 border-t">
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
              <span className="font-semibold">Telefone:</span>
              <span>{user.phone}</span>
              <span className="font-semibold">CPF:</span>
              <span>{user.cpf}</span>
            </div>
          </CardContent>
        )}
      </Card>
    </CreateUserDialog>
  );
}
