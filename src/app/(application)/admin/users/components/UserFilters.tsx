"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@prisma/client"

interface UserFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
}

export function UserFilter({ searchQuery, setSearchQuery, roleFilter, setRoleFilter }: UserFilterProps) {
  // Mapeamento de roles para português
  const roleLabels = {
    all: "Todos",
    [UserRole.admin]: "Administrador",
    [UserRole.sup]: "Suporte",
    [UserRole.teacher]: "Professor",
    [UserRole.student]: "Estudante",
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Input
        placeholder="Buscar por nome ou email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:max-w-xs"
      />
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por cargo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{roleLabels.all}</SelectItem>
          <SelectItem value={UserRole.admin}>{roleLabels[UserRole.admin]}</SelectItem>
          <SelectItem value={UserRole.sup}>{roleLabels[UserRole.sup]}</SelectItem>
          <SelectItem value={UserRole.teacher}>{roleLabels[UserRole.teacher]}</SelectItem>
          <SelectItem value={UserRole.student}>{roleLabels[UserRole.student]}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

