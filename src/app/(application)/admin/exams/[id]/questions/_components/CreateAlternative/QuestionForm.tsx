import { Control, FieldErrors } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DraggableAlternatives } from "./AlternativeItem/DraggableAlternatives";
import { ComboboxSelect } from "@/components/comboxSelect";
import { ComboboxCreate } from "@/components/comboboxCreate";
import { Editor } from "@/components/Editor";
import { questionSchema } from "../../_actions/QuestionSchema";
import { QuestionsDto } from "@/app/api/questions/route";

export type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  control: Control<QuestionFormValues>;
  errors: FieldErrors<QuestionFormValues>;

  disciplines: string[];
  texts: {
    id: string;
    label: string;
  }[];

  questions: QuestionsDto | null | undefined;
}

export function QuestionForm({
  control,
  disciplines,
  texts,
  errors,
  questions,
}: QuestionFormProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="discipline"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-between">
              <FormLabel className="text-sm font-medium">Disciplina</FormLabel>
              <FormControl>
                <ComboboxCreate
                  options={disciplines}
                  value={field.value}
                  onSetValue={field.onChange}
                  placeholder="Selecione uma disciplina"
                  emptyMessage="Nenhuma disciplina encontrada"
                  searchPlaceholder="Buscar disciplina"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="linkedTexts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Textos Vinculados
              </FormLabel>
              <FormControl>
                <ComboboxSelect
                  options={texts}
                  selectedTexts={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isAnnulled"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium">Anulado</FormLabel>
              <FormControl>
                <div className="flex h-10 items-center space-x-2 border rounded-md px-3 bg-background">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    id="canceled-checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="canceled-checkbox"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Questão anulada
                  </label>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="statement"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Enunciado</FormLabel>
            <FormControl>
              <Editor
                isPending={false} // TO-DO: implemente pedngin
                content={field.value}
                placeholder="Digite o enunciado da questão aqui"
                onChange={field.onChange}
                className="min-h-[150px] text-sm rounded-md border border-input bg-backgroud px-3 py-2"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel className="text-sm font-medium">Alternativas</FormLabel>
        <DraggableAlternatives control={control} questions={questions} />
        <FormMessage className="text-xs" />
      </FormItem>

      {errors.alternatives?.root && (
        <p className="text-sm text-destructive mt-2">
          {errors.alternatives.root.message}
        </p>
      )}
    </div>
  );
}
