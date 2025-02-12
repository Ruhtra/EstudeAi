"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExamsHeader } from "./components/ExamsHeader";
import { ExamsFilters } from "./components/ExamsFilters";
import { ExamsList } from "./components/ExamsList";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import type { ExamsDto } from "@/app/api/exams/route";

export default function ExamsPage() {
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { isPending, data } = useQuery<ExamsDto[]>({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await fetch("/api/exams");
      return await response.json();
    },
  });

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

  return (
    <div className="container mx-auto">
      <ExamsHeader />
      <ExamsFilters
        years={years}
        setFilterYear={setFilterYear}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <ExamsList exams={filteredAndSortedExams} />
      )}
    </div>
  );
}
