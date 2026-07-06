'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserMinus, Ban } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface FriendCardProps {
  friendship: any;
  onRemove: (friendshipId: string) => Promise<void>;
  onBlock: (profileId: string) => Promise<void>;
}

export function FriendCard({ friendship, onRemove, onBlock }: FriendCardProps) {
  const profile = friendship.friend_profile;
  const [confirmAction, setConfirmAction] = useState<'remove' | 'block' | null>(null);
  const [loading, setLoading] = useState(false);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const handleAction = async (action: 'remove' | 'block') => {
    setLoading(true);
    try {
      if (action === 'remove') await onRemove(friendship.id);
      else await onBlock(profile.id);
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10 flex items-center gap-4">
        <Link href={ROUTES.profile(profile.username)}>
          <Avatar className="w-14 h-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background cursor-pointer hover:ring-primary/40 transition-all">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={ROUTES.profile(profile.username)} className="hover:underline">
            <h3 className="font-semibold truncate">{profile.username}</h3>
          </Link>
          {profile.favorite_genre && (
            <Badge variant="outline" className="text-[10px] mt-1 bg-white/5 border-white/10">
              {profile.favorite_genre}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {confirmAction ? (
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <span className="text-xs text-muted-foreground">
                {confirmAction === 'remove' ? 'Unfriend?' : 'Block?'}
              </span>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 text-xs rounded-full px-2"
                disabled={loading}
                onClick={() => handleAction(confirmAction)}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs rounded-full px-2"
                onClick={() => setConfirmAction(null)}
              >
                No
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => setConfirmAction('remove')}
                title="Unfriend"
              >
                <UserMinus className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => setConfirmAction('block')}
                title="Block"
              >
                <Ban className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
