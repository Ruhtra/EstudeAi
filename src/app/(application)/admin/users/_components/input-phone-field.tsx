"use client"

import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type React from "react"

export interface InputPhoneFieldProps {
  isPending: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
}

export function InputPhoneField({ isPending, form }: InputPhoneFieldProps) {
  const [phone, setPhone] = useState<string>("")

  useEffect(() => {
    const formattedPhone = formatPhone(form.getValues("phone") || "")
    setPhone(formattedPhone)
    form.setValue("phone", formattedPhone)
  }, [form])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(event.target.value)
    setPhone(formatted)
    form.setValue("phone", formatted)
  }

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
              maxLength={16}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

