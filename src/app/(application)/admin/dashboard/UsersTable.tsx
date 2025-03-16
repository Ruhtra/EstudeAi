import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const users = [
  {
    id: "USR001",
    name: "Carlos Silva",
    email: "carlos.silva@exemplo.com",
    status: "active",
    registeredAt: "15/05/2023",
    lastLogin: "Hoje, 10:45",
  },
  {
    id: "USR002",
    name: "Ana Oliveira",
    email: "ana.oliveira@exemplo.com",
    status: "active",
    registeredAt: "22/06/2023",
    lastLogin: "Ontem, 15:30",
  },
  {
    id: "USR003",
    name: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    status: "inactive",
    registeredAt: "10/04/2023",
    lastLogin: "10/05/2023",
  },
  {
    id: "USR004",
    name: "Mariana Costa",
    email: "mariana.costa@exemplo.com",
    status: "pending",
    registeredAt: "05/06/2023",
    lastLogin: "Nunca",
  },
  {
    id: "USR005",
    name: "João Pereira",
    email: "joao.pereira@exemplo.com",
    status: "active",
    registeredAt: "30/05/2023",
    lastLogin: "Hoje, 09:15",
  },
]

export function UsersTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Cadastro</TableHead>
            <TableHead className="hidden md:table-cell">Último Login</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="hidden md:table-cell">{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"}
                >
                  {user.status === "active" ? "Ativo" : user.status === "inactive" ? "Inativo" : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{user.registeredAt}</TableCell>
              <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

