"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboBoxProps {
  options: {
    id: string;
    label: string;
  }[];
  value: string;
  onSetValue: (value: string) => void;
  placeholder: string;
  emptyMessage: string;
  searchPlaceholder: string;
  disabled?: boolean;
}
export function Combobox({
  options,
  value,
  onSetValue,
  placeholder,
  emptyMessage,
  searchPlaceholder,
  disabled,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? options.find(({ id }) => id === value)?.label
            : searchPlaceholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(({ id, label }) => (
                <CommandItem
                  key={id}
                  value={id}
                  onSelect={(currentValue) => {
                    onSetValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
