import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { CreateUserDialog } from "../_components/CreateUserDialog";

export function UserHeader({ children }: { children: ReactNode }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <>
      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <h1 className="text-3xl font-bold mb-3">Usuários</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        {children}
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>
    </>
  );
}
