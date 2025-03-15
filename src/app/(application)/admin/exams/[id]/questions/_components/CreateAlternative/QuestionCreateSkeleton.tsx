import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuestionCreateSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Discipline and Linked Texts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Statement */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-[150px] w-full rounded-md" />
      </div>

      {/* Alternatives */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />

        {/* Alternative Items */}
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-2 mb-3 border shadow-sm rounded-lg">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-5 w-5" /> {/* Grip */}
                <Skeleton className="h-8 w-32" /> {/* Content Type */}
                <Skeleton className="h-4 w-4 rounded-sm" /> {/* Checkbox */}
                <div className="flex-1" />
                <Skeleton className="h-8 w-8" /> {/* Remove button */}
              </div>
              <Skeleton className="h-24 w-full rounded-md" /> {/* Content area */}
            </CardContent>
          </Card>
        ))}

        {/* Add Alternative Button */}
        <Skeleton className="h-9 w-full rounded-md mt-4" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-full sm:w-32 rounded-md ml-auto" />
    </div>
  )
}

