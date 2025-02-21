"use client";

import type React from "react";
import { useCallback } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

export interface InputCpfFieldProps {
  isPending: boolean;
  form: UseFormReturn<any>;
}

export function InputCpfField({ isPending, form }: InputCpfFieldProps) {
  const formatCPF = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }, []);

  const handleCpfChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const formattedValue = formatCPF(inputValue);
      const digitsOnly = formattedValue.replace(/\D/g, "");
      form.setValue("cpf", digitsOnly, { shouldDirty: true });
    },
    [form, formatCPF]
  );

  return (
    <FormField
      control={form.control}
      name="cpf"
      render={() => (
        <FormItem>
          <FormLabel>CPF</FormLabel>
          <FormControl>
            <Input
              disabled={isPending}
              placeholder="000.000.000-00"
              value={formatCPF(form.watch("cpf") || "")}
              onChange={handleCpfChange}
              maxLength={14}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
