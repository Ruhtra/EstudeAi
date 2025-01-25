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
  options: string[];
  value: string;
  onSetValue: (value: string) => void;
  placeholder: string;
  emptyMessage: string;
  searchPlaceholder: string;
}
export function Combobox({
  options,
  value,
  onSetValue,
  placeholder,
  emptyMessage,
  searchPlaceholder,
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
        >
          {value
            ? options.find((options) => options === value)
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
              {options.map((options) => (
                <CommandItem
                  key={options}
                  value={options}
                  onSelect={(currentValue) => {
                    onSetValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {options}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === options ? "opacity-100" : "opacity-0"
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
