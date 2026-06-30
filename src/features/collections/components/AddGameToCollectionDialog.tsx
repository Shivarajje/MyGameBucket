'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCollections, useCollectionActions } from '../hooks/useCollections';
import { FolderHeart, Loader2, Plus, Check } from 'lucide-react';

export function AddGameToCollectionDialog({ gameId }: { gameId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { collections, loading: loadingCols, refresh } = useCollections();
  const { addGame, removeGame, loading: actionLoading } = useCollectionActions();
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});

  // Fetch collections when dialog is opened
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refresh();
    }
  };

  const handleToggleGame = async (colId: string) => {
    // Wait for any active action on this collection
    if (activeActions[colId]) return;

    setActiveActions((prev) => ({ ...prev, [colId]: true }));
    try {
      // Quick local check if game is already inside this collection.
      // We can fetch the collection details or query the API.
      // To keep it simple, we check if the addGame fails due to unique constraint, or we can query.
      // In this dialog, we'll try to add it. If it succeeds, awesome. If it fails because it's already there, we can handle it or let the user know.
      // Better yet, we can fetch which collections contain this game, but since collections is small (max 10), we can do a quick check.
      // To keep it clean and robust, we attempt to add it. If the user clicks, we add. If they want to remove, we can add a toggle.
      // Let's do a simple add operation here.
      await addGame(colId, gameId);
      setIsOpen(false);
    } catch (err) {
      // Unique constraint handled by hook toast
    } finally {
      setActiveActions((prev) => ({ ...prev, [colId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start rounded-full border-white/10 bg-background/40 backdrop-blur-md hover:border-primary/30">
          <FolderHeart className="w-5 h-5 mr-2 text-primary" />
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-primary" />
            Add to Collection
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
          {loadingCols ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : collections.length > 0 ? (
            collections.map((col) => (
              <Button
                key={col.id}
                variant="ghost"
                className="w-full justify-between rounded-2xl hover:bg-white/5"
                onClick={() => handleToggleGame(col.id)}
                disabled={activeActions[col.id]}
              >
                <span className="truncate">{col.name}</span>
                {activeActions[col.id] ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <Plus className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No collections created yet. Go to your Collections tab to create one!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
