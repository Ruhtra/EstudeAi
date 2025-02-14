import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { AlternativeItem } from ".";

interface SortableAlternativeProps {
  id: string;
  index: number;
  onRemove: () => void;
}

export function SortableAlternative({
  id,
  index,
  onRemove,
}: SortableAlternativeProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-2 mb-3 bg-background border-primary shadow-sm rounded-lg"
    >
      <AlternativeItem
        index={index}
        dragHandleProps={{ ...attributes, ...listeners }}
        onRemove={onRemove}
      />
    </Card>
  );
}
