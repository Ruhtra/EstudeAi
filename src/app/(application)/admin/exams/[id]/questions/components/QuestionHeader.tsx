import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import { CreateQuestionDialog } from "../_components/CreateQuestionDialog";
import { useState } from "react";
import { QuestionsSheet } from "../_components/CreateAlternative/QuestionSheet";

export function QuestionsHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <QuestionsSheet onOpenChange={setIsCreateOpen} open={isCreateOpen} />
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Provas
          </h1>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Questão
          </Button>
        </div>
      </div>
    </>
  );
}
