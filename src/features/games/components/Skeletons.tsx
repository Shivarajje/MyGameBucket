import { Skeleton } from '@/components/ui/skeleton';

export function GameCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/40 bg-card">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function GameHeroSkeleton() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden flex items-end">
      <Skeleton className="absolute inset-0 z-0 rounded-none" />
      
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-12 flex flex-col md:flex-row gap-6 md:items-end">
        <Skeleton className="hidden md:block w-48 aspect-[3/4] rounded-lg shrink-0" />
        
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-12 md:h-16 w-3/4 max-w-2xl" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
