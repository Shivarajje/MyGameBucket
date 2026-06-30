'use client';

import { useState, useEffect } from 'react';
import { useJournal } from '../hooks/useJournal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen, Trash2, Edit3 } from 'lucide-react';

interface JournalEntryFormProps {
  gameId: string;
}

export function JournalEntryForm({ gameId }: { gameId: string }) {
  const { entry, loading, saving, saveEntry, deleteEntry } = useJournal(gameId);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (entry) {
      setText(entry.entry);
      setIsEditing(false);
    } else {
      setText('');
      setIsEditing(true);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!text.trim()) return;
    try {
      await saveEntry(text);
      setIsEditing(false);
    } catch (e) {
      // Error handled by hook toast
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteEntry();
        setText('');
        setIsEditing(true);
      } catch (e) {
        // Error handled by hook toast
      }
    }
  };

  if (loading) {
    return (
      <Card className="bg-background/40 backdrop-blur-md border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-background/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Gaming Journal
        </CardTitle>
        {!isEditing && entry && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-red-500/20 hover:text-red-400 text-muted-foreground"
              onClick={handleDelete}
              disabled={saving}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              placeholder="What are your thoughts, feelings, or memorable moments from this play session? (Max 280 chars)"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 280))}
              rows={4}
              maxLength={280}
              className="rounded-2xl resize-none bg-background/50 border-white/10 focus-visible:ring-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {text.length}/280 characters
              </span>
              <div className="flex gap-2">
                {entry && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setText(entry.entry);
                      setIsEditing(false);
                    }}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving || !text.trim()}
                  className="rounded-full px-6"
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Memory
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <p className="text-foreground/90 italic leading-relaxed text-sm md:text-base pl-4 border-l-2 border-primary/50">
              &ldquo;{entry?.entry}&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                Saved {new Date(entry!.created_at).toLocaleDateString()}
              </span>
              {entry!.updated_at !== entry!.created_at && (
                <span>
                  Updated {new Date(entry!.updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
