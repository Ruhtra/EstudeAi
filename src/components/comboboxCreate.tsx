"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxProps {
  options: string[];
  value: string;
  onSetValue: (value: string) => void;
  placeholder: string;
  emptyMessage: string;
  searchPlaceholder: string;
}

export function ComboboxCreate({
  options: initialOptions,
  value,
  onSetValue,
  placeholder,
  emptyMessage,
  searchPlaceholder,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState(initialOptions);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    if (currentValue === "create-new") {
      if (inputValue && !options.includes(inputValue)) {
        setOptions((prev) => [...prev, inputValue]);
        onSetValue(inputValue);
      }
    } else {
      onSetValue(currentValue === value ? "" : currentValue);
    }
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (value && !options.includes(value)) {
      setOptions((prev) => prev.filter((option) => option !== value));
      onSetValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[full] justify-between"
        >
          {value || searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[full] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
            {inputValue && !options.includes(inputValue) && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => handleSelect("create-new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create &quot;{inputValue}&quot;
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}