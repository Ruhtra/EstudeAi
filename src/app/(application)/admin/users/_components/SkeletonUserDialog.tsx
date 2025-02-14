import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonUserDialog() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 mb-6 md:mb-0">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="w-full md:w-2/3">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
