import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { QuestionFormValues } from "../QuestionForm";
import { SortableAlternative } from "./SortableAlternative";

interface DraggableAlternativesProps {
  control: Control<QuestionFormValues>;
}

export function DraggableAlternatives({ control }: DraggableAlternativesProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "alternatives",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-2">
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableAlternative
              key={field.id}
              id={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableContext>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ content: "", contentType: "text", isCorrect: false })
        }
        className="w-full text-sm mt-4"
      >
        Digite alternativa
      </Button>
    </DndContext>
  );
}
