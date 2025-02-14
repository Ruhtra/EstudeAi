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

interface Text {
  id: string;
  title: string;
}

interface TextSelectorProps {
  texts: Text[];
  selectedTexts: string[];
  onChange: (selectedTexts: string[]) => void;
}

export function ComboboxSelect({
  texts,
  selectedTexts,
  onChange,
}: TextSelectorProps) {
  const handleSelect = (textId: string) => {
    const updatedSelection = selectedTexts.includes(textId)
      ? selectedTexts.filter((id) => id !== textId)
      : [...selectedTexts, textId];
    onChange(updatedSelection);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          //   aria-expanded={open}
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
              {texts.map((text) => (
                <CommandItem
                  key={text.id}
                  onSelect={() => handleSelect(text.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTexts.includes(text.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {text.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
