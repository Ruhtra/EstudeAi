import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YearPickerProps {
  disabled?: boolean;
  value: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearPicker({
  disabled = false,
  value,
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
}: YearPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(value);

  const years = React.useMemo(() => {
    const startYear = Math.max(minYear, currentYear - 5);
    const endYear = Math.min(maxYear, currentYear + 6);
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }, [currentYear, minYear, maxYear]);

  const handlePrevious = () => {
    setCurrentYear(Math.max(minYear, currentYear - 10));
  };

  const handleNext = () => {
    setCurrentYear(Math.min(maxYear, currentYear + 10));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <span>{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={disabled || currentYear <= minYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {years[0]} - {years[years.length - 1]}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={disabled || currentYear >= maxYear - 10}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {years.map((year) => (
            <Button
              disabled={disabled}
              key={year}
              variant={year === value ? "default" : "ghost"}
              className="h-8 w-full"
              onClick={() => {
                onChange(year);
                setCurrentYear(year);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
