import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamItem } from "./ExamItem";
import type { ExamsDto } from "@/app/api/exams/route";

interface DesktopExamListProps {
  exams: ExamsDto[];
}

export function DesktopExamList({ exams }: DesktopExamListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {/* <TableHead>Posição</TableHead> */}
            <TableHead>Ano</TableHead>
            <TableHead>Instituto</TableHead>
            <TableHead>Banca</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead className="w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <ExamItem exam={exam} isMobile={false} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
