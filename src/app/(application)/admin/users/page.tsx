"use client"

import { useState } from "react"
import type { UserDTO } from "./_actions/user"
import { useQuery } from "@tanstack/react-query"
import { UserList } from "./components/UserList"
import { UserSkeleton } from "./components/UserSkeleton"
import { UserHeader } from "./components/UsesHeader"
import { UserFilter } from "./components/UserFilters"

export default function UsersPage() {
  const { isPending, data } = useQuery<UserDTO[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users")
      return await response.json()
    },
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = data
    ? data.filter((user) => {
        // Filtro por nome ou email
        const matchesSearch =
          searchQuery === "" ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())

        // Filtro por cargo
        const matchesRole = roleFilter === "all" || user.role === roleFilter

        return matchesSearch && matchesRole
      })
    : []

  return (
    <>
      <div className="container mx-auto">
        <UserHeader>
          <UserFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
        </UserHeader>
        {isPending ? <UserSkeleton /> : <UserList users={filteredUsers} />}
      </div>
    </>
  )
}

