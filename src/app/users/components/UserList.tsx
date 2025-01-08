"use client";

import { useUsers } from "../hooks/useUsers";
import UserDialog from "./UserDialog";
import { Button } from "@/components/ui/button";

export default function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <ul className="space-y-4">
        {users?.map((user) => (
          <li
            key={user.id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Born: {new Date(user.birthDate).toLocaleDateString()}
              </p>
            </div>
            <UserDialog
              userId={user.id}
              trigger={<Button variant="outline">Edit</Button>}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
