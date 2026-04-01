import { Card, CardContent } from "./ui/card";

export function SkeletonProductCard() {
  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Image Skeleton with gradient shimmer */}
      <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        {/* Badge placeholder */}
        <div className="absolute top-2 left-2 w-12 h-5 bg-gray-300 rounded"></div>
        {/* Button placeholder */}
        <div className="absolute top-2 right-2 w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>

      <CardContent className="p-3 flex-1 flex flex-col space-y-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full animate-pulse"></div>
        </div>

        {/* Verified Badge */}
        <div className="h-3 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Delivery Info */}
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>

        {/* Stock Badge */}
        <div className="h-5 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>

        {/* Button */}
        <div className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse mt-auto"></div>
      </CardContent>
    </Card>
  );
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
        <div
          key={idx}
          className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"
        ></div>
      ))}
    </div>
  );
}
