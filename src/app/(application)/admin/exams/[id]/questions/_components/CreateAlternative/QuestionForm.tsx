import { Control } from "react-hook-form";
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
import { Input } from "@/components/ui/input";

export const questionFormSchema = z.object({
  number: z
    .number()
    .int()
    .positive("O número da questão deve ser um inteiro positivo"),
  linkedTexts: z.array(z.string()),
  statement: z
    .string()
    .min(1, "O enunciado é obrigatório")
    .max(1000, "O enunciado deve ter no máximo 1000 caracteres"),
  discipline: z.string().min(1, "A disciplina é obrigatória"),
  alternatives: z
    .array(
      z.object({
        content: z.string().min(1, "O conteúdo da alternativa é obrigatório"),
        contentType: z.enum(["text", "image"]),
      })
    )
    .min(2, "Deve haver pelo menos duas alternativas"),
  correctAlternative: z.string().min(1, "Deve haver uma alternativa correta"),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

const disciplines = [
  "Matemática",
  "Português",
  "História",
  "Geografia",
  "Ciências",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "Educação Física",
];

// Mock data for texts
const mockTexts = [
  { id: "1", title: "Texto IV" },
  { id: "2", title: "Texto V" },
  { id: "3", title: "Texto VI" },
];

interface QuestionFormProps {
  control: Control<QuestionFormValues>;
}

export function QuestionForm({ control }: QuestionFormProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Número da Questão
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  className="text-sm w-20"
                  placeholder="Nº"
                  max="999"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
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
                  texts={[...mockTexts]}
                  selectedTexts={field.value}
                  onChange={field.onChange}
                />
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
                value={field.value}
                placeHolder="Digite o enunciado da questão aqui"
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
        <DraggableAlternatives control={control} />
        <FormMessage className="text-xs" />
      </FormItem>
    </div>
  );
}
