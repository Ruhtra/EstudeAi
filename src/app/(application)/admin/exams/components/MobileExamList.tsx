import { Card, CardContent } from "@/components/ui/card"
import { ExamItem } from "./ExamItem"
import type { ExamsDto } from "@/app/api/exams/route"

interface MobileExamListProps {
  exams: ExamsDto[]
  expandedItems: Set<string>
  toggleExpand: (id: string) => void
}

export function MobileExamList({ exams, expandedItems, toggleExpand }: MobileExamListProps) {
  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <Card key={exam.id}>
          <CardContent className="p-4">
            <ExamItem
              exam={exam}
              isExpanded={expandedItems.has(exam.id)}
              onToggleExpand={() => toggleExpand(exam.id)}
              isMobile={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

