import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateExamDialog } from "../_components/CreateExamDialog";
import { useState } from "react";

export function ExamsHeader() {

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <CreateExamDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Provas
          </h1>
          <Button size="sm" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Exame
          </Button>
        </div>
      </div>
    </>
  );
}
