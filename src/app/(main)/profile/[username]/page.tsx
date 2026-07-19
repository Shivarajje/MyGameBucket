'use client';

import { use, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { usePublicProfile } from '@/features/profile/hooks/useProfile';
import { useUserJournal } from '@/features/journal/hooks/useJournal';
import { useUserLibrary } from '@/features/library/hooks/useLibrary';
import { useUserCollections } from '@/features/collections/hooks/useCollections';
import { JournalEntryCard } from '@/features/journal/components/JournalEntryCard';
import { LibraryCard } from '@/features/library/components/LibraryCard';
import { CollectionCard } from '@/features/collections/components/CollectionCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserX, BookOpen, Gamepad2, FolderHeart, Sparkles } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

type Tab = 'library' | 'collections' | 'journal';

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const { data, loading, error } = usePublicProfile(username);
  const { entries: journalEntries, loading: journalLoading } = useUserJournal(username);
  const { entries: libraryEntries, commonGameIds, loading: libraryLoading } = useUserLibrary(username);
  const { collections, loading: collectionsLoading } = useUserCollections(username);

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

  // Handle restricted profiles (Private or Friends Only when not friends)
  if ((data as any).restricted) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <ProfileHeader profile={data.profile} stats={null} />

          <div className="text-center py-16 mt-12 bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {data.profile.visibility === 'FriendsOnly' ? 'Friends Only Profile' : 'Private Profile'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto px-4">
              {data.profile.visibility === 'FriendsOnly'
                ? 'Send a friend request to view their library, stats, and journal memories.'
                : 'This user has set their profile to private.'}
            </p>
          </div>
        </Container>
      </main>
    );
  }

  const commonSet = new Set(commonGameIds);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'library', label: 'Library', icon: <Gamepad2 className="w-4 h-4" />, count: libraryEntries.length },
    { key: 'collections', label: 'Collections', icon: <FolderHeart className="w-4 h-4" />, count: collections.length },
    { key: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" />, count: journalEntries.length },
  ];

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <ProfileHeader profile={data.profile} stats={data.stats} />

        {/* Games in Common banner */}
        {commonGameIds.length > 0 && (
          <div className="mt-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">
                You both have {commonGameIds.length} {commonGameIds.length === 1 ? 'game' : 'games'}
              </span>{' '}
              <span className="text-muted-foreground">in your libraries — look for the &quot;Both played&quot; badge below.</span>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mt-10 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-background/40 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  ml-1 text-xs px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-white/10 text-muted-foreground'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div>
            {libraryLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
                ))}
              </div>
            ) : libraryEntries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {libraryEntries.map((entry) => (
                  <div key={entry.id} className="relative">
                    <LibraryCard entry={entry} />
                    {commonSet.has(entry.game_id) && (
                      <Badge className="absolute top-3 left-3 z-30 text-[10px] px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground border-0 shadow-md pointer-events-none">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Both played
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Gamepad2 className="w-12 h-12" />}
                title="No games yet"
                description={`${data.profile.username} hasn't added any games to their library.`}
              />
            )}
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div>
            {collectionsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-3xl" />
                ))}
              </div>
            ) : collections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FolderHeart className="w-12 h-12" />}
                title="No collections yet"
                description={`${data.profile.username} hasn't created any collections.`}
              />
            )}
          </div>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <div>
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
              <EmptyState
                icon={<BookOpen className="w-12 h-12" />}
                title="No journal entries yet"
                description={`${data.profile.username} hasn't shared any gaming memories.`}
              />
            )}
          </div>
        )}
      </Container>
    </main>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-16 bg-background/20 backdrop-blur-md border border-white/10 rounded-3xl">
      <div className="text-muted-foreground mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
