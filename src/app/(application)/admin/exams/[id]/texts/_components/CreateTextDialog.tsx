"use client";

import { useTransition, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
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
import { TiptapEditor } from "@/components/TipTapEditor";
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
import type { TextsDto } from "@/app/api/texts/route";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Store text content and image content separately
  const [textContent, setTextContent] = useState<string>("");
  const [imageContent, setImageContent] = useState<File | string | null>(null);

  const { data: textData, isLoading } = useQuery({
    queryKey: ["text", idText],
    queryFn: () => fetchText(idText),
    enabled: !!idText && open,
    refetchOnMount: true,
  });

  const defaultValues: Record<string, string> = {
    contentType: textData?.contentType || ContentType.text,
    content: "",
    reference: textData?.reference || "",
  };

  const form = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues,
  });

  // Handle initial data loading
  useEffect(() => {
    if (textData) {
      const contentType = textData.contentType as "text" | "image";

      // Set form values
      form.setValue("contentType", contentType ?? "text");
      form.setValue("reference", textData.reference ?? "");

      // Store content based on type, but don't set form value yet
      if (contentType === "text" && textData.content) {
        setTextContent(textData.content);
        form.setValue("content", textData.content);
      } else if (contentType === "image" && textData.content) {
        // For image type, check if it's a valid URL
        if (
          textData.content.startsWith("data:") ||
          textData.content.startsWith("http")
        ) {
          setPreviewUrl(textData.content);
          setImageContent(textData.content);
          form.setValue("content", textData.content);
        }
      }

      // Set other fields
      Object.entries(textData).forEach(([key, value]) => {
        if (key !== "content" && key !== "contentType") {
          form.setValue(key as keyof FormValues, value);
        }
      });
    }
  }, [textData, form]);

  // Update form content when content type changes
  useEffect(() => {
    const contentType = form.watch("contentType");

    // Clear form content first
    form.setValue("content", "");

    // Set appropriate content based on type
    if (contentType === "text") {
      form.setValue("content", textContent);
    } else if (contentType === "image" && imageContent) {
      form.setValue("content", imageContent);
    }
  }, [form.watch("contentType"), textContent, imageContent, form]);

  // Handle text content changes
  const handleTextContentChange = (value: string) => {
    setTextContent(value);
    form.setValue("content", value);
  };

  // Handle image content changes
  const handleImageContentChange = (file: File | null, url: string | null) => {
    setImageContent(file);
    setPreviewUrl(url);
    if (file) {
      form.setValue("content", file);
    } else {
      form.setValue("content", "");
    }
  };

  function onSubmit(values: z.infer<typeof textSchema>) {
    startTransition(async () => {
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
            setTextContent("");
            setImageContent(null);
            setPreviewUrl(null);
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
            setTextContent("");
            setImageContent(null);
            setPreviewUrl(null);
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
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="contentType"
                      render={({ field }) => (
                        <FormItem>
                          <ContentTypeSelect
                            value={field.value}
                            onChange={(value) => {
                              // Just change the content type, the useEffect will handle content switching
                              field.onChange(value);
                            }}
                            isPending={isPending}
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
                          {form.watch("contentType") === "text" ? (
                            <TiptapEditor
                              content={textContent}
                              onChange={handleTextContentChange}
                              placeholder="Digite o conteúdo do texto aqui..."
                              isPending={isPending}
                            />
                          ) : (
                            <ImageUploadFieldWithUrl
                              form={form}
                              name="content"
                              b=""
                              isPending={isPending}
                              previewUrl={previewUrl}
                              onImageChange={handleImageContentChange}
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
