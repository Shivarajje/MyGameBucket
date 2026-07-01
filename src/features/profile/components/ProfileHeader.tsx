'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Trophy, Clock, Star, User, Globe, Lock } from 'lucide-react';
import { DatabaseProfile } from '@/types/database';
import { GenreCategory } from '@/constants/enums';

interface ProfileHeaderProps {
  profile: DatabaseProfile;
  stats: {
    totalGames: number;
    completedGames: number;
    totalHours: number;
    averageRating: number | null;
  };
}

export function ProfileHeader({ profile, stats }: ProfileHeaderProps) {
  const initials = profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <Avatar className="w-24 h-24 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
          <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-2xl font-bold tracking-tight">{profile.username}</h1>
            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
              {profile.favorite_genre || 'Gamer'}
            </Badge>
          </div>

          {profile.bio && (
            <p className="text-muted-foreground mt-1 max-w-md">{profile.bio}</p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-sm">
              <Gamepad2 className="w-4 h-4 text-primary" />
              <span className="font-semibold">{stats.totalGames}</span>
              <span className="text-muted-foreground">games</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-semibold">{stats.completedGames}</span>
              <span className="text-muted-foreground">completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold">{stats.totalHours}h</span>
              <span className="text-muted-foreground">played</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
