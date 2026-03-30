import { Card, CardContent } from "./ui/card";

export function SkeletonProductCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200"></div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-1 mb-2">
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonProductCard key={idx} />
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="h-12 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );
}
