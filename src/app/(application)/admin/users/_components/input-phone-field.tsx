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

export interface InputPhoneFieldProps {
  isPending: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function InputPhoneField({ isPending, form }: InputPhoneFieldProps) {
  const [phone, setPhone] = useState<string>("");

  const formatPhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(
      3,
      7
    )}-${digits.slice(7, 11)}`;
  }, []);

  const handlePhoneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const formattedValue = formatPhone(inputValue);
      setPhone(formattedValue);

      // Update the form value with only digits
      form.setValue("phone", formattedValue.replace(/\D/g, ""));
    },
    [form, formatPhone]
  );

  useEffect(() => {
    const currentValue = form.getValues("phone") || "";
    setPhone(formatPhone(currentValue));
  }, [form, formatPhone]);

  return (
    <FormField
      control={form.control}
      name="phone"
      render={() => (
        <FormItem>
          <FormLabel>Telefone</FormLabel>
          <FormControl>
            <Input
              disabled={isPending}
              placeholder="(xx) x xxxx-xxxx"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={16} // Adjusted for full formatted length
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
