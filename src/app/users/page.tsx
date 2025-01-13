import { Suspense } from "react";
import UserDialog from "./components/UserDialog";
import UserList from "./components/UserList";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UserDialog trigger={<Button>Add User</Button>} />
      <div>
        <Suspense fallback={<div>Loading user list...</div>}>
          <UserList />
        </Suspense>
      </div>
    </div>
  );
}
