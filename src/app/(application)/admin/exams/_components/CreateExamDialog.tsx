"use client"
import { FormControl, FormField, FormLabel, FormItem, FormMessage, Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useExamOptions } from "../_queries/examQueries"
import { ComboboxCreate } from "@/components/comboboxCreate"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { YearPicker } from "./YearPicker"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    year: z
        .number()
        .min(1900, { message: "O ano deve ser após 1900." })
        .max(new Date().getFullYear(), { message: `O ano deve ser no máximo ${new Date().getFullYear()}.` }),
    instituto: z.string().min(1, { message: "Instituto é obrigatório" }),
    banca: z.string().min(1, { message: "Banca é obrigatória" }),
    level: z.string().min(1, { message: "Nível é obrigatório" }),
    position: z.string().min(1, { message: "Posição é obrigatória" }),
    name: z.string().min(1, { message: "Nome é obrigatório" }),
})

type FormData = z.infer<typeof formSchema>

export const CreateExamDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            instituto: "",
            banca: "",
            level: "",
            position: "",
            name: "",
        },
    })

    const { institutes, banks, levels, positions, isLoading, isError } = useExamOptions()

    if (isError) {
        return <div>Error loading options. Please try again later.</div>
    }

    const onSubmit = async (data: FormData) => {
        // Handle form submission here
        onOpenChange(false)
        console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Criar Exame</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm font-medium">Ano</FormLabel>
                                            <FormControl>
                                                <YearPicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    minYear={1900}
                                                    maxYear={new Date().getFullYear()}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm font-medium">Nível</FormLabel>
                                            <FormControl>
                                                <ComboboxCreate
                                                    options={levels}
                                                    value={field.value}
                                                    onSetValue={field.onChange}
                                                    placeholder="Selecione o nível"
                                                    emptyMessage="Nenhum nível encontrado."
                                                    searchPlaceholder="Procurar nível..."
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Nome do Exame</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instituto"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium">Instituto</FormLabel>
                                        <FormControl>
                                            <ComboboxCreate
                                                options={institutes}
                                                value={field.value}
                                                onSetValue={field.onChange}
                                                placeholder="Selecione o instituto"
                                                emptyMessage="Nenhum instituto encontrado."
                                                searchPlaceholder="Procurar instituto..."
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="banca"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium">Banca</FormLabel>
                                        <FormControl>
                                            <ComboboxCreate
                                                options={banks}
                                                value={field.value}
                                                onSetValue={field.onChange}
                                                placeholder="Selecione a banca"
                                                emptyMessage="Nenhuma banca encontrada."
                                                searchPlaceholder="Procurar banca..."
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium">Posição</FormLabel>
                                        <FormControl>
                                            <ComboboxCreate
                                                options={positions}
                                                value={field.value}
                                                onSetValue={field.onChange}
                                                placeholder="Selecione a posição"
                                                emptyMessage="Nenhuma posição encontrada."
                                                searchPlaceholder="Procurar posição..."
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" className="text-sm">
                                    Criar Exame
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

