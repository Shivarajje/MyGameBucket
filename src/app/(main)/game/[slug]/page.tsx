import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { gameService } from '@/services/gameService';
import { GameHero } from '@/features/games/components/GameHero';
import { GameInfo } from '@/features/games/components/GameInfo';
import { GameActions } from '@/features/games/components/GameActions';
import { ScreenshotGallery } from '@/features/games/components/ScreenshotGallery';
import { Container } from '@/components/layout/Container';

import { createClient } from '@/lib/supabase/server';
import { libraryService } from '@/services/libraryService';
import { profileService } from '@/services/profileService';
import { JournalEntryForm } from '@/features/journal/components/JournalEntryForm';

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await gameService.getGame(slug);

  if (!game) {
    return { title: 'Game Not Found | MyGameBucket' };
  }

  return {
    title: `${game.title} | MyGameBucket`,
    description: game.summary || `Details for ${game.title}`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await gameService.getGame(slug);

  if (!game) {
    notFound();
  }

  // Check if game is in user's library to allow journal entries
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let inLibrary = false;
  if (user) {
    const profile = await profileService.getProfileByUserId(user.id);
    if (profile) {
      inLibrary = await libraryService.isGameInLibrary(profile.id, game.id);
    }
  }

  return (
    <main className="flex-1 flex flex-col pb-20 pt-28">
      <GameHero game={game} />
      
      <Container className="mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-12 min-w-0">
            <GameInfo game={game} />
            {inLibrary && <JournalEntryForm gameId={game.id} />}
            <ScreenshotGallery game={game} />
          </div>
          
          <div className="w-full md:w-auto">
            <GameActions gameId={game.id} />
          </div>
        </div>
      </Container>
    </main>
  );
}
