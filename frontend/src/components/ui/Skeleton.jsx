export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-sm bg-gray-200/80 ${className}`} aria-hidden="true" />;
}

export function CardListSkeleton({ count = 4, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-md border border-gray-200 bg-white p-4 flex gap-3">
          <Skeleton className="h-16 w-16 shrink-0 rounded-sm" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-md border border-gray-200 bg-white overflow-hidden">
          <Skeleton className="h-36 w-full rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-9 w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4" role="status" aria-label="Loading">
      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
  );
}
