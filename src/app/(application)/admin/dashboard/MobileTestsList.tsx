import { Card, CardContent } from "@/components/ui/card"
import { TestItem } from "./TestItem"
import type { TestDTO } from "./TestsList"

interface MobileTestsListProps {
  tests: TestDTO[]
  expandedItems: Set<string>
  toggleExpand: (id: string) => void
}

export function MobileTestsList({ tests, expandedItems, toggleExpand }: MobileTestsListProps) {
  return (
    <div className="space-y-3">
      {tests.map((test) => (
        <Card key={test.id}>
          <CardContent className="p-3">
            <TestItem
              test={test}
              isExpanded={expandedItems.has(test.id.toString())}
              onToggleExpand={() => toggleExpand(test.id.toString())}
              isMobile={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

