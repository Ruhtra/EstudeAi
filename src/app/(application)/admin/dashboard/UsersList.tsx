"use client"

import { useState } from "react"
import { MobileUsersList } from "./MobileUsersList"
import { DesktopUsersList } from "./DesktopUsersList"
import { useMediaQuery } from "./mediaQuery"

// Definindo o tipo para os dados de usuário
export interface UserDTO {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  registeredAt: string
  lastLogin: string
}

// Dados de exemplo
export const usersData: UserDTO[] = [
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

interface UsersListProps {
  users?: UserDTO[]
}

export function UsersList({ users = usersData }: UsersListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (isMobile) {
    return <MobileUsersList users={users} expandedItems={expandedItems} toggleExpand={toggleExpand} />
  }

  return <DesktopUsersList users={users} />
}

