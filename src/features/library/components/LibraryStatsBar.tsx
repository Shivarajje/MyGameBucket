'use client';

import { Gamepad2, Trophy, Clock, Star } from 'lucide-react';

interface LibraryStatsBarProps {
  totalGames: number;
  completedGames: number;
  totalHours: number;
}

export function LibraryStatsBar({ totalGames, completedGames, totalHours }: LibraryStatsBarProps) {
  const stats = [
    { icon: Gamepad2, label: 'Total Games', value: String(totalGames) },
    { icon: Trophy, label: 'Completed', value: String(completedGames) },
    { icon: Clock, label: 'Hours Played', value: `${totalHours}h` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-4 transition-all hover:border-primary/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <stat.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
