"use client"

import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type React from "react"

export interface InputCpfFieldProps {
  isPending: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
}

export function InputCpfField({ isPending, form }: InputCpfFieldProps) {
  const [cpf, setCpf] = useState<string>("")

  useEffect(() => {
    const formattedCpf = formatCPF(form.getValues("cpf") || "")
    setCpf(formattedCpf)
    form.setValue("cpf", formattedCpf)
  }, [form])

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "")
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(event.target.value)
    setCpf(formatted)
    form.setValue("cpf", formatted)
  }

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
              maxLength={14}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

