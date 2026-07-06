'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, Loader2, Clock } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface SentRequestCardProps {
  request: any;
  onCancel: (friendshipId: string) => Promise<void>;
}

export function SentRequestCard({ request, onCancel }: SentRequestCardProps) {
  const profile = request.addressee_profile;
  const [loading, setLoading] = useState(false);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const handleCancel = async () => {
    setLoading(true);
    try { await onCancel(request.id); } finally { setLoading(false); }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-5 hover:border-yellow-500/20 transition-all duration-300">
      <div className="relative z-10 flex items-center gap-4">
        <Link href={ROUTES.profile(profile.username)}>
          <Avatar className="w-12 h-12 ring-2 ring-yellow-500/20 ring-offset-2 ring-offset-background cursor-pointer">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="text-sm font-bold bg-yellow-500/20 text-yellow-400">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={ROUTES.profile(profile.username)} className="hover:underline">
            <h3 className="font-semibold truncate">{profile.username}</h3>
          </Link>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </p>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-muted-foreground hover:text-destructive"
          disabled={loading}
          onClick={handleCancel}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <X className="w-4 h-4 mr-1" />}
          Cancel
        </Button>
      </div>
    </div>
  );
}
