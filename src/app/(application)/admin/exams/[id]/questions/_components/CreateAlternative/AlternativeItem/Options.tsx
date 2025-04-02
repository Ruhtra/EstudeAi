"use client";

import type React from "react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { GripVertical, X } from "lucide-react";
import type { QuestionFormValues } from "../QuestionForm";
import { useFormContext } from "react-hook-form";
import { ContentTypeSelect } from "@/components/ContentTypeSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface OptionsProps {
  index: number;
  dragHandleProps: React.HTMLAttributes<HTMLDivElement>;
  onRemove: () => void;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Options({
  index,
  dragHandleProps,
  onRemove,
  setPreviewImage,
}: OptionsProps) {
  const { control, setValue, watch } = useFormContext<QuestionFormValues>();
  const alternatives = watch("alternatives");
  const isCorrect = watch(`alternatives.${index}.isCorrect`);

  const handleRadioChange = () => {
    // Uncheck all alternatives
    alternatives.forEach((_, i) => {
      setValue(`alternatives.${i}.isCorrect`, false);
    });
    // Check only this one
    setValue(`alternatives.${index}.isCorrect`, true);
  };

  return (
    <>
      <div {...dragHandleProps} className="cursor-move">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <FormField
        control={control}
        name={`alternatives.${index}.contentType`}
        render={({ field }) => (
          <ContentTypeSelect
            value={field.value}
            onChange={field.onChange}
            onTypeChange={() => {
              setValue(`alternatives.${index}.content`, "");
              setPreviewImage(null);
            }}
            label=""
            className="w-32"
          />
        )}
      />
      <FormField
        control={control}
        name={`alternatives.${index}.isCorrect`}
        render={() => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={isCorrect ? "true" : "false"}
                onValueChange={(value) => {
                  if (value === "true") {
                    handleRadioChange();
                  }
                }}
              >
                <RadioGroupItem value="true" id={`correct-${index}`} />
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 ml-auto"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
}
