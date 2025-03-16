"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import type { UserDTO } from "./UsersList"
import { ChevronDown, ChevronUp } from "lucide-react"

interface UserItemProps {
  user: UserDTO
  isExpanded?: boolean
  onToggleExpand?: () => void
  isMobile: boolean
}

// Componentes personalizados para o card mobile
const ItemMobile = ({ children }: { children: React.ReactNode; isExpanded?: boolean }) => (
  <div className="w-full">{children}</div>
)

const ItemMobileHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-start">{children}</div>
)

const ItemMobileHeaderTitle = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="flex flex-col">
    <h3 className="font-medium text-sm">{title}</h3>
    {children}
  </div>
)

const ItemMobileHeaderBadges = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-2 mt-1">{children}</div>
)

const ItemMobileHeaderOptions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center">{children}</div>
)

const ItemMobileTrigger = ({ isExpanded, onClick }: { isExpanded?: boolean; onClick?: () => void }) => (
  <button className="ml-2" onClick={onClick}>
    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
)

const ItemMobileContent = ({ children, isExpanded }: { children: React.ReactNode; isExpanded?: boolean }) => (
  <div className={`mt-3 ${isExpanded ? "block" : "hidden"}`}>{children}</div>
)

const ItemMobileContentData = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
)

// Componente para células da tabela desktop
const ItemDesktopCell = ({ children }: { children: React.ReactNode }) => <td className="p-3">{children}</td>

export function UserItem({ user, isExpanded, onToggleExpand, isMobile }: UserItemProps) {
  if (isMobile) {
    return (
      <ItemMobile isExpanded={isExpanded}>
        <ItemMobileHeader>
          <div>
            <ItemMobileHeaderTitle title={user.name}>
              <ItemMobileHeaderBadges>
                <Badge
                  variant={user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"}
                >
                  {user.status === "active" ? "Ativo" : user.status === "inactive" ? "Inativo" : "Pendente"}
                </Badge>
              </ItemMobileHeaderBadges>
            </ItemMobileHeaderTitle>
          </div>
          <ItemMobileHeaderOptions>
            <ItemMobileTrigger isExpanded={isExpanded} onClick={onToggleExpand} />
          </ItemMobileHeaderOptions>
        </ItemMobileHeader>
        <ItemMobileContent isExpanded={isExpanded}>
          <ItemMobileContentData>
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
            <span className="text-muted-foreground">Cadastro:</span>
            <span>{user.registeredAt}</span>
            <span className="text-muted-foreground">Último login:</span>
            <span>{user.lastLogin}</span>
          </ItemMobileContentData>
        </ItemMobileContent>
      </ItemMobile>
    )
  }

  return (
    <>
      <ItemDesktopCell>{user.name}</ItemDesktopCell>
      <ItemDesktopCell>{user.email}</ItemDesktopCell>
      <ItemDesktopCell>
        <Badge variant={user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"}>
          {user.status === "active" ? "Ativo" : user.status === "inactive" ? "Inativo" : "Pendente"}
        </Badge>
      </ItemDesktopCell>
      <ItemDesktopCell>{user.registeredAt}</ItemDesktopCell>
      <ItemDesktopCell>{user.lastLogin}</ItemDesktopCell>
    </>
  )
}

