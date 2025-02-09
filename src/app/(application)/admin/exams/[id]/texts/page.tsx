'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import Link from "next/link";

export interface Text {
  id: string;
  number: string;
  linkedQuestions: number;
  content: string;
  reference: string;
}

const textData: Text[] = [
  {
    id: "1",
    number: "001",
    linkedQuestions: 5,
    content: "Este é um exemplo de texto...",
    reference: "Fonte: Livro X, Autor Y, 2023",
  },
  {
    id: "2",
    number: "002",
    linkedQuestions: 3,
    content: "Outro exemplo de texto...",
    reference: "Fonte: Artigo Z, Revista W, 2022",
  },
];

export default function TextsExamPage() {
  const [texts, setTexts] = useState<Text[]>(textData);
    const {id : examId} = useParams<{ id: string  }>()
  

  const handleEdit = (textId: string) => {
    // Implement edit functionality
    console.log(`Edit text ${textId}`);
  };

  const handleDelete = (textId: string) => {
    // Implement delete functionality
    console.log(`Delete text ${textId}`);
    setTexts(texts.filter((t) => t.id !== textId));
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Textos do Exame {examId}
        </h1>
        <Link href={`./texts/create`}>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Texto
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {texts.map((text) => (
          <Card
            key={text.id}
            className="h-full transition-shadow hover:shadow-md"
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Texto {text.number}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(text.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(text.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="mb-2 text-sm text-gray-500 line-clamp-3">
                {text.content}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  Nº {text.number}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {text.linkedQuestions} questões vinculadas
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}