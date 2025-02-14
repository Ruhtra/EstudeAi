import { Card, CardContent } from "@/components/ui/card";
import { TextsDto } from "@/app/api/texts/route";
import { TextItem } from "./TextItem";

interface MobileExamListProps {
  texts: TextsDto[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
}

export function MobileTextList({
  texts,
  expandedItems,
  toggleExpand,
}: MobileExamListProps) {
  return (
    <div className="space-y-4">
      {texts.map((text) => (
        <Card key={text.id}>
          <CardContent className="p-4">
            <TextItem
              text={text}
              isExpanded={expandedItems.has(text.id)}
              onToggleExpand={() => toggleExpand(text.id)}
              isMobile={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
