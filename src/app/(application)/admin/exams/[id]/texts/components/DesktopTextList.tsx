import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TextsDto } from "@/app/api/texts/route";
import { TextItem } from "./TextItem";

interface DesktopUserListProps {
  texts: TextsDto[];
}

export function DesktopTextList({ texts }: DesktopUserListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead>Qtd. Questões</TableHead>
            {/* <TableHead>Cargo</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>CPF</TableHead> */}
            <TableHead className="w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {texts.map((text) => (
            <TableRow key={text.id}>
              <TextItem text={text} isMobile={false} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
