import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { QuestionFormValues } from "../QuestionForm";
import { ImageArea } from "./ImageArea";
import { Options } from "./Options";
import { Editor } from "@/components/Editor";

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
  const { control, watch } = useFormContext<QuestionFormValues>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Options
          index={index}
          dragHandleProps={dragHandleProps}
          onRemove={onRemove}
          setPreviewImage={setPreviewImage}
        />
      </div>
      <FormField
        control={control}
        name={`alternatives.${index}.content`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="relative">
                {watch(`alternatives.${index}.contentType`) == "text" ? (
                  <Editor
                    placeholder={`Digite a alternativa ${String.fromCharCode(
                      65 + index
                    )}`}
                    isPending={false} // TO-DO: add pednign
                    content={field.value}
                    onChange={field.onChange}
                  />
                ) : (
                  <ImageArea
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    index={index}
                  />
                )}
                {/* <div
                  style={{ display: contentType === "text" ? "block" : "none" }}
                >
                  <Editor
                    placeHolder={`Digite a alternativa ${String.fromCharCode(
                      65 + index
                    )}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
                {contentType === "image" && (
                  <>
                    <h1 className="bg-red-500">
                      Atenção ainda não pode subir imagem
                    </h1>
                    <ImageArea
                      previewImage={previewImage}
                      setPreviewImage={setPreviewImage}
                      index={index}
                    />
                  </>
                )} */}
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
