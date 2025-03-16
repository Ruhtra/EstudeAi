import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TestItem } from "./TestItem"
import type { TestDTO } from "./TestsList"

interface DesktopTestsListProps {
  tests: TestDTO[]
}

export function DesktopTestsList({ tests }: DesktopTestsListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Disciplina</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Questões</TableHead>
            <TableHead>Textos</TableHead>
            <TableHead>Realizações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TestItem test={test} isMobile={false} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

