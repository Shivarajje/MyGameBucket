'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Clock, UserPlus, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useFriendActions } from '@/features/friends/hooks/useFriends';
import { toast } from 'sonner';

interface DiscoverCardProps {
  data: {
    profile: any;
    stats: {
      totalGames: number;
      completedGames: number;
      totalHours: number;
    };
  };
}

export function DiscoverCard({ data }: DiscoverCardProps) {
  const { profile, stats } = data;
  const { sendRequest, actionLoading } = useFriendActions();
  const [requested, setRequested] = useState(false);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const handleAddFriend = async () => {
    try {
      await sendRequest(profile.id);
      setRequested(true);
      toast.success(`Friend request sent to ${profile.username}!`);
    } catch (error: any) {
      if (error.message?.includes('pending') || error.message?.includes('Already')) {
        setRequested(true);
      }
      toast.error(error.message || 'Failed to send request');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link href={ROUTES.profile(profile.username)}>
            <Avatar className="w-16 h-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background cursor-pointer hover:ring-primary/40 transition-all">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
              <AvatarFallback className="text-lg font-bold bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={ROUTES.profile(profile.username)} className="hover:underline">
              <h3 className="font-bold text-lg truncate">{profile.username}</h3>
            </Link>
            {profile.favorite_genre && (
              <Badge variant="outline" className="text-[10px] mt-1 bg-white/5 border-white/10">
                {profile.favorite_genre}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-5 text-sm">
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{stats.totalGames}</span>
            <span className="text-muted-foreground text-xs">games</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{stats.completedGames}</span>
            <span className="text-muted-foreground text-xs">done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{stats.totalHours}h</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {requested ? (
            <Button variant="outline" className="flex-1 rounded-full" disabled>
              <Clock className="w-4 h-4 mr-2" />
              Request Sent
            </Button>
          ) : (
            <Button className="flex-1 rounded-full" onClick={handleAddFriend} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Add Friend
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={ROUTES.profile(profile.username)} title="View Profile">
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
