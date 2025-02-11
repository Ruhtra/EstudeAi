"use client";

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
import { CreateExamDialog } from "./_components/CreateExamDialog";
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
import type { ExamsDto } from "@/app/api/exams/route";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { publishExam, unPublishExam } from "./_actions/exam";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryCLient";

export default function ExamsPage() {
  const { isPending, data } = useQuery<ExamsDto[]>({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await fetch("/api/exams");
      return await response.json();
    },
  });

  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const years = data
    ? Array.from(new Set(data.map((exam) => exam.year))).sort((a, b) => b - a)
    : [];

  const filteredAndSortedExams = data
    ? data
        .filter((exam) => filterYear === "all" || exam.year === filterYear)
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a.year - b.year;
          } else {
            return b.year - a.year;
          }
        })
    : [];

  const togglePublish = async (id: string, isComplete: boolean) => {
    if (isComplete) {
      unPublishExam(id)
        .then((data) => {
          if (data.error) toast(data.error);
          if (data.success) {
            queryClient.refetchQueries({
              queryKey: ["exams"],
            });

            toast("Exame despublicado com sucesso");
          }
        })
        .catch(() => {
          toast("Algo deu errado, informe o suporte!");
        });
    } else {
      publishExam(id)
        .then((data) => {
          if (data.error) toast(data.error);
          if (data.success) {
            queryClient.refetchQueries({
              queryKey: ["exams"],
            });

            toast("Exame publicado com sucesso");
          }
        })
        .catch(() => {
          toast("Algo deu errado, informe o suporte!");
        });
    }
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

  const LoadingSkeleton = () => (
    <>
      {/* Mobile and Tablet Skeleton */}
      <div className="lg:hidden space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );

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
                  <h3 className="font-medium">{exam.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{exam.year}</Badge>
                    <Badge variant={exam.isComplete ? "default" : "secondary"}>
                      {exam.isComplete ? "Publicado" : "Não publicado"}
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
                    <span className="text-muted-foreground">Posição:</span>
                    <span>{exam.position}</span>
                    <span className="text-muted-foreground">Instituto:</span>
                    <span>{exam.instituteName}</span>
                    <span className="text-muted-foreground">Banca:</span>
                    <span>{exam.bankName}</span>
                    <span className="text-muted-foreground">Nível:</span>
                    <span>{exam.level}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/exams/${exam.id}/questions`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Questões
                    </Button>
                  </Link>
                  <Link
                    href={`/admin/exams/${exam.id}/texts`}
                    className="flex-1"
                  >
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
                      <CreateExamDialog idExam={exam.id}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </CreateExamDialog>
                      <DropdownMenuItem
                        onClick={() => togglePublish(exam.id, exam.isComplete)}
                      >
                        {exam.isComplete ? (
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
                        // onClick={() => handleDelete(exam.id)}
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
            <TableHead>Name</TableHead>
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
              <TableCell>{exam.name}</TableCell>
              <TableCell>{exam.position}</TableCell>
              <TableCell>
                <Badge variant="secondary">{exam.year}</Badge>
              </TableCell>
              <TableCell>{exam.instituteName}</TableCell>
              <TableCell>
                <Badge variant="outline">{exam.bankName}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{exam.level}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={exam.isComplete ? "default" : "secondary"}>
                  {exam.isComplete ? "Publicado" : "Não publicado"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/exams/${exam.id}/questions`}>
                    <Button variant="outline" size="sm">
                      Questões
                    </Button>
                  </Link>
                  <Link href={`/admin/exams/${exam.id}/texts`}>
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
                    <CreateExamDialog idExam={exam.id}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    </CreateExamDialog>
                    <DropdownMenuItem
                      onClick={() => togglePublish(exam.id, exam.isComplete)}
                    >
                      {exam.isComplete ? (
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
                      // onClick={() => handleDelete(exam.id)}
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
          <CreateExamDialog>
            <Button size="sm" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Exame
            </Button>
          </CreateExamDialog>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            onValueChange={(value) =>
              setFilterYear(value === "all" ? "all" : Number.parseInt(value))
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

      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="lg:hidden">
            <MobileView />
          </div>
          <div className="hidden lg:block">
            <DesktopView />
          </div>
        </>
      )}
    </div>
  );
}
