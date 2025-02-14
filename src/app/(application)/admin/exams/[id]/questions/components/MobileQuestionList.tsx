import { Card, CardContent } from "@/components/ui/card";
import { QuestionItem } from "./QuestionItem";
import type { QuestionsDto } from "@/app/api/questions/route";

interface MobileQuestionListProps {
  questions: QuestionsDto[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
}

export function MobileQuestionList({
  questions,
  expandedItems,
  toggleExpand,
}: MobileQuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardContent className="p-4">
            <QuestionItem
              question={question}
              isExpanded={expandedItems.has(question.id)}
              onToggleExpand={() => toggleExpand(question.id)}
              isMobile={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
