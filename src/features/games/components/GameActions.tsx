'use client';

import { Button } from '@/components/ui/button';
import { Plus, Check, Clock, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLibraryActions } from '@/features/library/hooks/useLibrary';
import { GameStatus } from '@/constants/enums';
import { STATUS_LABELS } from '@/constants/labels';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import { AddGameToCollectionDialog } from '@/features/collections/components/AddGameToCollectionDialog';

export function GameActions({ gameId }: { gameId: string }) {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing);
  const [checking, setChecking] = useState(true);
  const { addToLibrary, updateEntry, removeFromLibrary, loading } = useLibraryActions();

  // Check if game is already in library
  useEffect(() => {
    async function checkLibrary() {
      try {
        const res = await fetch(`/api/library?gameId=${gameId}`);
        if (res.ok) {
          const result = await res.json();
          const match = result.data?.find((e: any) => e.game_id === gameId);
          if (match) {
            setEntryId(match.id);
            setStatus(match.status as GameStatus);
          }
        }
      } catch {
        // Silently fail — user might not be logged in
      } finally {
        setChecking(false);
      }
    }
    checkLibrary();
  }, [gameId]);

  const handleAdd = async () => {
    try {
      const entry = await addToLibrary(gameId, GameStatus.Playing);
      setEntryId(entry.id);
      setStatus(GameStatus.Playing);
      toast.success('Added to library!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to library');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!entryId) return;
    try {
      await updateEntry(entryId, { status: newStatus });
      setStatus(newStatus as GameStatus);
      toast.success(`Status updated to ${STATUS_LABELS[newStatus as GameStatus]}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleRemove = async () => {
    if (!entryId) return;
    try {
      await removeFromLibrary(entryId);
      setEntryId(null);
      setStatus(GameStatus.Playing);
      toast.success('Removed from library');
    } catch {
      toast.error('Failed to remove from library');
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col gap-3 w-full md:w-64 shrink-0">
        <div className="bg-background/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full md:w-64 shrink-0">
      <div className="bg-background/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Library</h4>

        {!entryId ? (
          <Button
            className="w-full justify-start rounded-full"
            size="lg"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Add to Library
          </Button>
        ) : (
          <>
            <Button className="w-full justify-start rounded-full" variant="secondary" size="lg" disabled>
              <Check className="w-5 h-5 mr-2 text-primary" />
              In Library
            </Button>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full rounded-full bg-background/40 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GameStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AddGameToCollectionDialog gameId={gameId} />

            <Button
              className="w-full justify-start rounded-full"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </>
        )}
      </div>

      <div className="bg-background/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Playtime</h4>
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-bold text-xl">--</div>
            <div className="text-xs text-muted-foreground">Hours played</div>
          </div>
        </div>
      </div>
    </div>
  );
}
