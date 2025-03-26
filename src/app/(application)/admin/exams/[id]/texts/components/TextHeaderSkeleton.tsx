import { Skeleton } from "@/components/ui/skeleton";

export function TextHeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-9 w-32" />
    </div>
  );
}
