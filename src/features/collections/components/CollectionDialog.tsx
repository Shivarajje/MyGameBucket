'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface CollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string | null) => Promise<any>;
  initialData?: { name: string; description: string | null };
  title: string;
}

export function CollectionDialog({ isOpen, onClose, onSave, initialData, title }: CollectionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSave(name.trim(), description.trim() || null);
      onClose();
    } catch (error) {
      // Handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="col-name">Collection Name</Label>
            <Input
              id="col-name"
              placeholder="e.g. Masterpieces, Cozy Games"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              className="rounded-full bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-desc">Description (Optional)</Label>
            <Textarea
              id="col-desc"
              placeholder="A brief description of this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={250}
              rows={3}
              className="rounded-2xl resize-none bg-background/50 border-white/10"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="rounded-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
