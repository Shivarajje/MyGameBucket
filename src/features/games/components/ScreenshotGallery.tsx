'use client';

import { useState } from 'react';
import { GameDetail } from '@/types/game';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ScreenshotGalleryProps {
  game: GameDetail;
}

export function ScreenshotGallery({ game }: ScreenshotGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!game.screenshots || game.screenshots.length === 0) {
    return null;
  }

  // We skip the first screenshot if it was used as the hero, or just show all.
  // Showing all is fine.
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Screenshots</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {game.screenshots.map((url, i) => (
          <button
            key={url}
            className="relative aspect-video rounded-md overflow-hidden group cursor-zoom-in ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setSelectedImage(url)}
          >
            <img 
              src={url} 
              alt={`Screenshot ${i + 1}`} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-1 bg-transparent border-none shadow-none">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Screenshot fullscreen" 
              className="w-full h-auto rounded-md object-contain max-h-[85vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
