'use client';

import { GameStatus } from '@/constants/enums';
import { STATUS_LABELS } from '@/constants/labels';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface LibraryFiltersProps {
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onStatusChange: (status: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function LibraryFilters({
  status,
  sortBy,
  sortOrder,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
}: LibraryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Status filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] rounded-full bg-background/40 backdrop-blur-md border-white/10">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {Object.values(GameStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort by */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[150px] rounded-full bg-background/40 backdrop-blur-md border-white/10">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="added_at">Date Added</SelectItem>
          <SelectItem value="started_at">Started Date</SelectItem>
          <SelectItem value="hours_played">Hours Played</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort order toggle */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/40 backdrop-blur-md border-white/10 hover:border-primary/30"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        <ArrowUpDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
