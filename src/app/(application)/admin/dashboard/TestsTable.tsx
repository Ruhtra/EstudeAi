import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const tests = [
  {
    id: "TST001",
    title: "Avaliação de Matemática - Ensino Médio",
    discipline: "math",
    status: "published",
    questions: 25,
    texts: 3,
    createdAt: "10/05/2023",
    completions: 345,
  },
  {
    id: "TST002",
    title: "Prova de Português - Gramática",
    discipline: "language",
    status: "published",
    questions: 30,
    texts: 5,
    createdAt: "15/05/2023",
    completions: 289,
  },
  {
    id: "TST003",
    title: "Avaliação de Ciências - Biologia",
    discipline: "science",
    status: "unpublished",
    questions: 20,
    texts: 2,
    createdAt: "22/04/2023",
    completions: 156,
  },
  {
    id: "TST004",
    title: "História do Brasil - Período Colonial",
    discipline: "history",
    status: "unpublished",
    questions: 15,
    texts: 4,
    createdAt: "01/06/2023",
    completions: 0,
  },
  {
    id: "TST005",
    title: "Geografia - Clima e Vegetação",
    discipline: "geography",
    status: "published",
    questions: 22,
    texts: 3,
    createdAt: "28/05/2023",
    completions: 178,
  },
]

export function TestsTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Disciplina</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Questões</TableHead>
            <TableHead className="hidden md:table-cell">Textos</TableHead>
            <TableHead className="hidden md:table-cell">Realizações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.id}</TableCell>
              <TableCell>{test.title}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">
                  {test.discipline === "math"
                    ? "Matemática"
                    : test.discipline === "language"
                      ? "Português"
                      : test.discipline === "science"
                        ? "Ciências"
                        : test.discipline === "history"
                          ? "História"
                          : "Geografia"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={test.status === "published" ? "default" : "destructive"}>
                  {test.status === "published" ? "Publicado" : "Não publicado"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{test.questions}</TableCell>
              <TableCell className="hidden md:table-cell">{test.texts}</TableCell>
              <TableCell className="hidden md:table-cell">{test.completions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

