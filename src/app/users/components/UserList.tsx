import { use } from "react";
import { getUsers, deleteUser } from "../actions";
import UserDialog from "./UserDialog";
import { Button } from "@/components/ui/button";
import { Actionsbtns } from "./ActionsBtn";

export default function UserList() {
  // Carregar usuários diretamente com `use`
  const users = use(getUsers());

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <ul className="space-y-4">
        {users.map((user) => {
          return (
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
              <Actionsbtns id={user.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
