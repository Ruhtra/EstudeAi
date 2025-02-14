"use client";

import { useState } from "react";
import { type UserDTO } from "./_actions/user";
import { useQuery } from "@tanstack/react-query";
import { UserList } from "./components/UserList";
import { UserSkeleton } from "./components/UserSkeleton";
import { UserHeader } from "./components/UsesHeader";
import { UserFilter } from "./components/UserFilters";

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

  return (
    <>
      <div className="container mx-auto">
        <UserHeader>
          <UserFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </UserHeader>
        {isPending ? <UserSkeleton /> : <UserList users={filteredUsers} />}
      </div>
    </>
  );
}
