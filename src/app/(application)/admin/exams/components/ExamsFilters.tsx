import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ExamsFiltersProps {
  years: number[];
  setFilterYear: (year: number | "all") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function ExamsFilters({
  years,
  setFilterYear,
  sortOrder,
  setSortOrder,
}: ExamsFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center mb-4">
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
  );
}
