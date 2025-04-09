"use client";

import type React from "react";
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

  content: string | null;
  initualUrl: string | null;
}

export function AlternativeItem({
  index,
  dragHandleProps,
  onRemove,

  content,
  initualUrl,
}: AlternativeItemProps) {
  const form = useFormContext<QuestionFormValues>();
  const { control, watch, setValue } = form;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Options
          index={index}
          dragHandleProps={dragHandleProps}
          onRemove={onRemove}
        />
      </div>
      {watch(`alternatives.${index}.contentType`) === "text" ? (
        <FormField
          control={control}
          name={`alternatives.${index}.content`}
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Editor
                    placeholder={`Digite a alternativa ${String.fromCharCode(65 + index)}`}
                    isPending={false} // TO-DO: add pending
                    content={content || ""}
                    onChange={(value) => {
                      setValue(`alternatives.${index}.content`, value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={control}
          name={`alternatives.${index}.content`}
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <ImageUploadFieldWithUrl
                    form={form}
                    name={`alternatives.${index}.file`}
                    isPending={false}
                    initialUrl={initualUrl}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
