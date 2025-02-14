import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { GripVertical, X } from "lucide-react";
import { QuestionFormValues } from "../QuestionForm";
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
        name="correctAlternative"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex items-center"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`correct-${index}`}
                />
                <label
                  htmlFor={`correct-${index}`}
                  className="text-xs text-gray-600 ml-1"
                >
                  Correta
                </label>
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
