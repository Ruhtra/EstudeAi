import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserItem } from "./UserItem";
import { UserDTO } from "../_actions/user";

interface DesktopUserListProps {
  users: UserDTO[];
}

export function DesktopUserList({ users }: DesktopUserListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead className="w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <UserItem user={user} isMobile={false} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
