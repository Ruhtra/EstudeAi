'use client'

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
// import { CreateExamDialog } from "./CreateExamDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export interface Exam {
  id: string;
  year: number;
  instituto: string;
  banca: string;
  position: string;
  level: string;
}

const examData: Exam[] = [
  {
    id: "4fd4eeb1-7c98-4b4b-9121-5f1cb4956b0e",
    year: 2023,
    instituto: "Instituto Federal",
    banca: "CESPE",
    position: "Professor de Matemática",
    level: "Superior",
  },
  {
    id: "5fd4eeb1-7c98-4b4b-9121-5f1cb4956b0f",
    year: 2022,
    instituto: "Universidade Federal",
    banca: "CEBRASPE",
    position: "Professor de Física",
    level: "Superior",
  },
];

export default function ExamsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [publishedExams, setPublishedExams] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  //TO-DO: Remove this
  console.log(isCreateDialogOpen);

  const years = Array.from(new Set(examData.map((exam) => exam.year))).sort(
    (a, b) => b - a
  );

  const filteredAndSortedExams = examData
    .filter((exam) => filterYear === "all" || exam.year === filterYear)
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });

  const handleEdit = (id: string) => {
    console.log(`Edit exam ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete exam ${id}`);
  };

  const togglePublish = (id: string) => {
    setPublishedExams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const MobileView = () => (
    <div className="space-y-4">
      {filteredAndSortedExams.map((exam) => (
        <Card key={exam.id}>
          <CardContent className="p-4">
            <Collapsible
              open={expandedItems.has(exam.id)}
              onOpenChange={() => toggleExpand(exam.id)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{exam.position}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{exam.year}</Badge>
                    <Badge
                      variant={
                        publishedExams.has(exam.id) ? "default" : "secondary"
                      }
                    >
                      {publishedExams.has(exam.id)
                        ? "Publicado"
                        : "Não publicado"}
                    </Badge>
                  </div>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedItems.has(exam.id) ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-4">
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Instituto:</span>
                    <span>{exam.instituto}</span>
                    <span className="text-muted-foreground">Banca:</span>
                    <span>{exam.banca}</span>
                    <span className="text-muted-foreground">Nível:</span>
                    <span>{exam.level}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`${exam.id}/questions`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Questões
                    </Button>
                  </Link>
                  <Link href={`${exam.id}/texts`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Textos
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(exam.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => togglePublish(exam.id)}>
                        {publishedExams.has(exam.id) ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Publicar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const DesktopView = () => (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posição</TableHead>
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
          {filteredAndSortedExams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.position}</TableCell>
              <TableCell>
                <Badge variant="secondary">{exam.year}</Badge>
              </TableCell>
              <TableCell>{exam.instituto}</TableCell>
              <TableCell>
                <Badge variant="outline">{exam.banca}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{exam.level}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    publishedExams.has(exam.id) ? "default" : "secondary"
                  }
                >
                  {publishedExams.has(exam.id) ? "Publicado" : "Não publicado"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link href={`${exam.id}/questions`}>
                    <Button variant="outline" size="sm">
                      Questões
                    </Button>
                  </Link>
                  <Link href={`${exam.id}/texts`}>
                    <Button variant="outline" size="sm">
                      Textos
                    </Button>
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(exam.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublish(exam.id)}>
                      {publishedExams.has(exam.id) ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Despublicar
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Publicar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(exam.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Provas
          </h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Exame
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            onValueChange={(value) =>
              setFilterYear(value === "all" ? "all" : parseInt(value))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-full sm:w-auto"
          >
            {sortOrder === "asc" ? (
              <ChevronUp className="mr-2 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4" />
            )}
            {sortOrder === "asc" ? "Mais antigos" : "Mais recentes"}
          </Button>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileView />
      </div>
      <div className="hidden lg:block">
        <DesktopView />
      </div>

      {/* <CreateExamDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      /> */}
    </div>
  );
}