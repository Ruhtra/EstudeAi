"use client";

import { useState } from "react";
import { QuestionCard } from "./_components/QuestionCard";
// import { QuestionsSheet } from "./CreateAlternative/QuestionsSheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

interface Question {
  id: string;
  statement: string;
  discipline: string;
  alternatives: {
    id: string;
    content: string;
    isCorrect: boolean;
  }[];
}

const mockQuestions: Question[] = [
  {
    id: "1",
    statement: "What is the capital of France?",
    discipline: "Geography",
    alternatives: [
      { id: "a", content: "London", isCorrect: false },
      { id: "b", content: "Paris", isCorrect: true },
      { id: "c", content: "Berlin", isCorrect: false },
      { id: "d", content: "Madrid", isCorrect: false },
    ],
  },
  {
    id: "2",
    statement: "Who painted the Mona Lisa?",
    discipline: "Art History",
    alternatives: [
      { id: "a", content: "Vincent van Gogh", isCorrect: false },
      { id: "b", content: "Leonardo da Vinci", isCorrect: true },
      { id: "c", content: "Pablo Picasso", isCorrect: false },
      { id: "d", content: "Michelangelo", isCorrect: false },
    ],
  },
];

export default function QuestionsExamPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const { id: examId } = useParams<{ id: string }>();

  const handleEdit = (questionId: string) => {
    // Implement edit functionality
    console.log(`Edit question ${questionId}`);
  };

  const handleDelete = (questionId: string) => {
    // Implement delete functionality
    console.log(`Delete question ${questionId}`);
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  return (
    <div className="container mx-auto">
      <h1 className="bg-red-500">
        ATENÇÃO! AINDA ESTAMOS IMPORTANTE ESSA TELA
      </h1>
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Questões do Exame {examId}
        </h1>
        {/* <QuestionsSheet /> */}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            actionMenu={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(question.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        ))}
      </div>
    </div>
  );
}
