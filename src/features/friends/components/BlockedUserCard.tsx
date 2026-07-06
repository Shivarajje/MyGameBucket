'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShieldOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface BlockedUserCardProps {
  block: any;
  onUnblock: (profileId: string) => Promise<void>;
}

export function BlockedUserCard({ block, onUnblock }: BlockedUserCardProps) {
  const profile = block.blocked_profile;
  const [loading, setLoading] = useState(false);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const handleUnblock = async () => {
    setLoading(true);
    try { await onUnblock(profile.id); } finally { setLoading(false); }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md border border-red-500/10 p-5">
      <div className="relative z-10 flex items-center gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-red-500/20 ring-offset-2 ring-offset-background grayscale">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
          <AvatarFallback className="text-sm font-bold bg-red-500/20 text-red-400">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate text-muted-foreground">{profile.username}</h3>
          <p className="text-xs text-red-400/60">Blocked</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-muted-foreground hover:text-foreground"
          disabled={loading}
          onClick={handleUnblock}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ShieldOff className="w-4 h-4 mr-1" />}
          Unblock
        </Button>
      </div>
    </div>
  );
}
