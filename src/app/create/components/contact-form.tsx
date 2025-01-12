'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { contactFormAction } from './actions'
import { contactFormSchema } from './schema'
import { Check } from 'lucide-react'

type FormValues = z.infer<typeof contactFormSchema>

export function ContactForm({ className }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = React.useState({
    success: false,
    errors: null as Record<string, string | undefined> | null,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
      
      const result = await contactFormAction(null, formData)
      
      if (result.success) {
        setFormState({ success: true, errors: null })
        form.reset()
      } else {
        setFormState({ success: false, errors: result.errors ? { ...result.errors } : null })
      }
    })
  }

  React.useEffect(() => {
    if (formState.errors) {
      Object.entries(formState.errors).forEach(([key, value]) => {
        if (value) {
          form.setError(key as keyof FormValues, {
            type: 'manual',
            message: value,
          })
        }
      })
    }
  }, [formState.errors, form])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>How can we help?</CardTitle>
        <CardDescription>
          Need help with your project? We&apos;re here to assist you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {formState.success && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Check className="h-4 w-4" />
                Your message has been sent. Thank you.
              </p>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lee Robinson" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="leerob@acme.com" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here..." 
                      className="resize-none" 
                      {...field} 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

