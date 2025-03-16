import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserItem } from "./UserItem"
import type { UserDTO } from "./UsersList"

interface DesktopUsersListProps {
  users: UserDTO[]
}

export function DesktopUsersList({ users }: DesktopUsersListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead>Último Login</TableHead>
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
  )
}

