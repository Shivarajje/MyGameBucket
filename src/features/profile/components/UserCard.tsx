'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DatabaseProfile } from '@/types/database';

export function UserCard({ profile }: { profile: DatabaseProfile }) {
  const initials = profile.username.slice(0, 2).toUpperCase();

  return (
    <Link href={`/profile/${profile.username}`}>
      <Card className="group bg-background/40 backdrop-blur-md border border-white/10 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(202,138,4,0.15)] transition-all duration-300 cursor-pointer p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-10 h-10 ring-1 ring-white/10">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
              {profile.username}
            </h4>
            {profile.favorite_genre && (
              <Badge variant="outline" className="text-[9px] px-2 py-0 bg-white/5 border-white/10 text-muted-foreground mt-0.5">
                {profile.favorite_genre}
              </Badge>
            )}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Card>
    </Link>
  );
}
