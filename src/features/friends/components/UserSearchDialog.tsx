'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FriendshipButton } from './FriendshipButton';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface UserSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSearchDialog({ isOpen, onClose }: UserSearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  // Debounced/Triggered search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Find Friends
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username..."
            className="pl-10 rounded-full bg-white/5 border-white/10 focus:border-primary/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 min-h-[250px] pr-1 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Searching users...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((user) => {
              const initials = user.username.slice(0, 2).toUpperCase();
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Link href={ROUTES.profile(user.username)} onClick={onClose}>
                      <Avatar className="w-10 h-10 ring-1 ring-primary/20 cursor-pointer">
                        <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                        <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={ROUTES.profile(user.username)}
                        onClick={onClose}
                        className="font-medium hover:underline block truncate text-sm"
                      >
                        {user.username}
                      </Link>
                      {user.favorite_genre && (
                        <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                          {user.favorite_genre}
                        </span>
                      )}
                    </div>
                  </div>

                  <FriendshipButton profileId={user.id} className="h-8 text-xs px-3" />
                </div>
              );
            })
          ) : query.trim() ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No public users found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Type a username to start searching.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
