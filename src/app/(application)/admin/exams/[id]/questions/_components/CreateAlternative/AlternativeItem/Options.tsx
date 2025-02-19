import type React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { GripVertical, X } from "lucide-react";
import type { QuestionFormValues } from "../QuestionForm";
import { useFormContext } from "react-hook-form";
import { ContentTypeSelect } from "@/components/ContentTypeSelect";
import { Checkbox } from "@/components/ui/checkbox";
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
  const { control, setValue } = useFormContext<QuestionFormValues>();

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
            onTypeChange={(value) => {
              if (value === "text") {
                setValue(`alternatives.${index}.content`, "");
                setPreviewImage(null);
              }
            }}
            label=""
            className="w-32"
          />
        )}
      />
      <FormField
        control={control}
        name={`alternatives.${index}.isCorrect`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={`correct-${index}`}
              />
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
