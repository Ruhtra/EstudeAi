"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function InputCpfField({ isPending, form }: InputCpfFieldProps) {
  const [cpf, setCpf] = useState<string>("");

  const formatCPF = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9, 11)}`;
  }, []);

  const handleCpfChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const formattedValue = formatCPF(inputValue);
      setCpf(formattedValue);

      // Update the form value with only digits
      form.setValue("cpf", formattedValue.replace(/\D/g, ""));
    },
    [form, formatCPF]
  );

  useEffect(() => {
    const currentValue = form.getValues("cpf") || "";
    setCpf(formatCPF(currentValue));
  }, [form, formatCPF]);

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
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14} // 11 digits + formatting
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
