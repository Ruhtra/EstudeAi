import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { QuestionForm, questionFormSchema } from "./QuestionForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
interface QuestionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function QuestionsSheet({ onOpenChange, open }: QuestionsSheetProps) {
  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      number: undefined,
      linkedTexts: [],
      statement: "",
      discipline: "",
      alternatives: [
        { content: "", contentType: "text" },
        { content: "", contentType: "text" },
      ],
      correctAlternative: "",
    },
  });

  function onSubmit(values: z.infer<typeof questionFormSchema>) {
    console.log(values);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl p-4 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                Nova Questão
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <QuestionForm control={form.control} />
            </div>
            <SheetFooter>
              <Button type="submit" className="w-full sm:w-auto">
                Criar Questão
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
