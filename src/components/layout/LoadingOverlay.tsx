'use client';

import { useEffect, useState } from 'react';
import { LOADING_MESSAGES } from '@/constants/loading-messages';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ message, fullScreen = false }: LoadingOverlayProps) {
  const [randomMessage, setRandomMessage] = useState<string>('');

  useEffect(() => {
    if (!message) {
      const randomIdx = Math.floor(Math.random() * LOADING_MESSAGES.length);
      setRandomMessage(LOADING_MESSAGES[randomIdx]);
    }
  }, [message]);

  const displayMessage = message || randomMessage || 'Loading...';

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm z-50",
        fullScreen ? "fixed inset-0" : "absolute inset-0 min-h-[400px] rounded-lg"
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-medium text-muted-foreground animate-pulse">
        {displayMessage}
      </p>
    </div>
  );
}
