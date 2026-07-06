'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface FriendRequestCardProps {
  request: any;
  onAccept: (friendshipId: string) => Promise<void>;
  onReject: (friendshipId: string) => Promise<void>;
}

export function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  const profile = request.requester_profile;
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);
  const initials = profile.username.slice(0, 2).toUpperCase();

  const handleAccept = async () => {
    setLoading('accept');
    try { await onAccept(request.id); } finally { setLoading(null); }
  };

  const handleReject = async () => {
    setLoading('reject');
    try { await onReject(request.id); } finally { setLoading(null); }
  };

  const timeAgo = getTimeAgo(request.created_at);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 p-5 hover:border-primary/20 transition-all duration-300">
      <div className="absolute top-0 left-0 -ml-6 -mt-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-4">
        <Link href={ROUTES.profile(profile.username)}>
          <Avatar className="w-12 h-12 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-background cursor-pointer">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="text-sm font-bold bg-blue-500/20 text-blue-400">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={ROUTES.profile(profile.username)} className="hover:underline">
            <h3 className="font-semibold truncate">{profile.username}</h3>
          </Link>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="rounded-full h-9 px-4"
            disabled={loading !== null}
            onClick={handleAccept}
          >
            {loading === 'accept' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
            Accept
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-9 px-4 text-muted-foreground hover:text-destructive"
            disabled={loading !== null}
            onClick={handleReject}
          >
            {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateString).toLocaleDateString();
}
