import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuestionItem } from "./QuestionItem";
import type { QuestionsDto } from "@/app/api/questions/route";

interface DesktopQuestionListProps {
  questions: QuestionsDto[];
}

export function DesktopQuestionList({ questions }: DesktopQuestionListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Pergunta</TableHead>
            <TableHead>Disciplina</TableHead>
            <TableHead className="w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <QuestionItem question={question} isMobile={false} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
