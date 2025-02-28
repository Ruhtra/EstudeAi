"use client";

import { useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContentTypeSelect } from "@/components/ContentTypeSelect";
import TiptapEditor from "@/components/TipTapEditor";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { textSchema } from "../_actions/TextSchema";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { TextsDto } from "@/app/api/texts/route";
import { ContentType } from "@prisma/client";
import { ImageUploadFieldWithUrl } from "./Image-upload-field-url";
import { queryClient } from "@/lib/queryCLient";
import { createText, updateText } from "../_actions/text";
import { CreateSkeletonText } from "./SkeletonTextDialog";

interface CreateTextDialogProps {
  idText?: string;
  idExam: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type FormValues = z.infer<typeof textSchema>;

export function CreateTextDialog({
  idText,
  idExam,
  onOpenChange,
  open,
}: CreateTextDialogProps) {
  const [isPending, startTransition] = useTransition();

  const { data: textData, isLoading } = useQuery({
    queryKey: ["text", idText],
    queryFn: () => fetchText(idText),
    enabled: !!idText && open,
    refetchOnMount: true,
  });

  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      number: textData?.number || "",
      contentType: textData?.contentType || ContentType["text"],
      content: textData?.content || "",
      reference: textData?.reference || "",
    },
  });

  useEffect(() => {
    if (textData) {
      Object.entries(textData).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });

      form.setValue(
        "contentType",
        (textData.contentType.toLowerCase() as "text" | "image") ?? "text"
      );
      form.setValue("number", textData.number ?? "");
      form.setValue("content", textData.content ?? "");
      form.setValue("reference", textData.reference ?? "");
    }
  }, [textData, form]);

  function onSubmit(values: z.infer<typeof textSchema>) {
    startTransition(async () => {
      console.log(values);

      try {
        if (idText) {
          const data = await updateText(idText, values);
          if (data.error) toast(data.error);
          if (data.success) {
            await queryClient.refetchQueries({
              queryKey: ["texts", idExam],
            });
            queryClient.removeQueries({
              queryKey: ["text", idText],
            });
            onOpenChange(false);
            form.reset();
            toast("Texto atualizado com sucesso");
          }
        } else {
          const data = await createText(values, idExam);
          if (data.error) toast(data.error);
          if (data.success) {
            await queryClient.refetchQueries({
              queryKey: ["texts", idExam],
            });
            onOpenChange(false);
            form.reset();
            toast("Texto criado com sucesso");
          }
        }
      } catch {
        toast("Algo deu errado, contate o suporte!");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {idText ? "Editar Texto" : "Adicionar Novo texto"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do texto abaixo.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <CreateSkeletonText />
        ) : (
          <div className="container mx-auto">
            <div className="w-full max-w-4xl mx-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Nº do texto
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-sm"
                              placeholder="Ex: 34"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contentType"
                      render={({ field }) => (
                        <FormItem>
                          <ContentTypeSelect
                            value={field.value}
                            onChange={field.onChange}
                            isPending={isPending}
                            onTypeChange={() => {
                              form.setValue("content", "");
                              //TODO: Usuário está perdendo os dados ao trocar de aba
                              //informar a ele que será limpo ao salvar estados separados para que fique salvo
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Conteúdo
                        </FormLabel>
                        <FormControl>
                          {form.watch("contentType") == "text" ? (
                            <TiptapEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Digite o conteúdo do texto aqui..."
                              isPending={isPending}
                            />
                          ) : (
                            <ImageUploadFieldWithUrl
                              form={form}
                              name="content"
                              initialImageUrl={field.value}
                              isPending={isPending}
                            />
                          )}
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Referência
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="text-sm italic"
                            placeholder="Digite a referência aqui"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button disabled={isPending} type="submit" className="w-full">
                    {idText ? "Atualizar Texto" : "Criar Texto"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

async function fetchText(id: string | undefined): Promise<TextsDto | null> {
  if (id) {
    const response = await fetch(`/api/texts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch text");
    }
    return response.json();
  }
  return null;
}
