import { useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { TextsDto } from "@/app/api/texts/route";
import { DisciplinesDto } from "@/app/api/disciplines/route";

const fetchDisciplines = async (): Promise<DisciplinesDto[]> => {
  const response = await fetch(`/api/disciplines`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users`);
  }
  return response.json();
};

const fetchTexts = async (): Promise<TextsDto[]> => {
  const response = await fetch(`/api/texts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users`);
  }
  return response.json();
};

export const useQuestionOptions = () => {
  const results = useQueries({
    queries: [
      { queryKey: ["disciplines"], queryFn: fetchDisciplines },
      { queryKey: ["texts"], queryFn: fetchTexts },
    ],
  });

  const isError = results.some((result) => result.isError);
  const isLoading = results.some((result) => result.isLoading);

  if (isError && !isLoading) {
    toast("Não foi possível carregar os dados para a criação do dialog");
  }
  const disciplines = results[0].data ?? [];
  const texts = results[1].data ?? [];

  return {
    disciplines,
    texts,
    isLoading,
    isError,
  };
};
