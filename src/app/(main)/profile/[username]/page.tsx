'use client';

import { use } from 'react';
import { Container } from '@/components/layout/Container';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { usePublicProfile } from '@/features/profile/hooks/useProfile';
import { useUserJournal } from '@/features/journal/hooks/useJournal';
import { JournalEntryCard } from '@/features/journal/components/JournalEntryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { UserX, BookOpen } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const { data, loading, error } = usePublicProfile(username);
  const { entries: journalEntries, loading: journalLoading } = useUserJournal(username);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <Skeleton className="h-48 rounded-3xl" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 pt-28">
        <UserX className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Profile not found</h2>
        <p className="text-sm text-muted-foreground">This user doesn&apos;t exist or their profile is private.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <ProfileHeader profile={data.profile} stats={data.stats} />

        {/* Journal Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Journal Memories
          </h2>
          {journalLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-3xl" />
              ))}
            </div>
          ) : journalEntries.length > 0 ? (
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
              No journal entries shared yet.
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
