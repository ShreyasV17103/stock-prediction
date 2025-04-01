import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div>
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

