"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { QuestionFormValues } from "../QuestionForm";
import { Options } from "./Options";
import { Editor } from "@/components/Editor";
import { ImageUploadFieldWithUrl } from "../../../../texts/_components/Image-upload-field-url";

interface AlternativeItemProps {
  index: number;
  dragHandleProps: React.HTMLAttributes<HTMLDivElement>;
  onRemove: () => void;
}

export function AlternativeItem({
  index,
  dragHandleProps,
  onRemove,
}: AlternativeItemProps) {
  const form = useFormContext<QuestionFormValues>();
  const { control, watch, setValue } = form;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Store text content and image content separately
  const [textContent, setTextContent] = useState<string>("");
  const [imageContent, setImageContent] = useState<File | string | null>(null);

  // Get the current content and contentType
  const contentType = watch(`alternatives.${index}.contentType`);
  const content = watch(`alternatives.${index}.content`);

  // Initialize content based on existing form data
  useEffect(() => {
    console.log(`Alternative ${index} contentType:`, contentType);
    console.log(`Alternative ${index} content:`, content);

    if (contentType === "text" && content) {
      setTextContent(content as string);
    } else if (contentType === "image" && content) {
      // Handle both File objects and string URLs
      if (content instanceof File) {
        // If it's already a File object
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(content);
        setImageContent(content);
      } else if (
        typeof content === "string" &&
        (content.startsWith("data:") || content.startsWith("http"))
      ) {
        // If it's a string URL
        console.log(`Setting preview URL for alternative ${index}:`, content);
        setPreviewUrl(content);
        setImageContent(content);
      }
    }
  }, [contentType, content, index]);

  // Handle image content changes
  const handleImageContentChange = (file: File | null, url: string | null) => {
    setImageContent(file);
    setPreviewUrl(url);
    if (file) {
      setValue(`alternatives.${index}.content`, file);
    } else if (url) {
      setValue(`alternatives.${index}.content`, url);
    } else {
      setValue(`alternatives.${index}.content`, "");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Options
          index={index}
          dragHandleProps={dragHandleProps}
          onRemove={onRemove}
          setPreviewImage={setPreviewUrl}
        />
      </div>
      <FormField
        control={control}
        name={`alternatives.${index}.content`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="relative">
                {contentType === "text" ? (
                  <Editor
                    placeholder={`Digite a alternativa ${String.fromCharCode(65 + index)}`}
                    isPending={false} // TO-DO: add pending
                    content={field.value as string}
                    onChange={field.onChange}
                  />
                ) : (
                  <ImageUploadFieldWithUrl
                    form={form}
                    name={`alternatives.${index}.content`}
                    b=""
                    isPending={false}
                    previewUrl={previewUrl}
                    onImageChange={handleImageContentChange}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
