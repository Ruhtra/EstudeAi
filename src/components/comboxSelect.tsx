import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

interface TextSelectorProps {
  options: {
    id: string;
    label: string;
  }[];
  selectedTexts: string[];
  onChange: (selectedTexts: string[]) => void;
}

export function ComboboxSelect({
  options,
  selectedTexts,
  onChange,
}: TextSelectorProps) {
  const handleSelect = (title: string) => {
    const updatedSelection = selectedTexts.includes(title)
      ? selectedTexts.filter((t) => t !== title)
      : [...selectedTexts, title];
    onChange(updatedSelection);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedTexts.length > 0
            ? `${selectedTexts.length} texto${
                selectedTexts.length > 1 ? "s" : ""
              } selecionado${selectedTexts.length > 1 ? "s" : ""}`
            : "Selecionar textos"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar texto..." />
          <CommandList>
            <CommandEmpty>Nenhum texto encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map(({ id, label }) => (
                <CommandItem key={id} onSelect={() => handleSelect(id)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTexts.includes(id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
