'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FriendCard } from '@/features/friends/components/FriendCard';
import { FriendRequestCard } from '@/features/friends/components/FriendRequestCard';
import { SentRequestCard } from '@/features/friends/components/SentRequestCard';
import { BlockedUserCard } from '@/features/friends/components/BlockedUserCard';
import { UserSearchDialog } from '@/features/friends/components/UserSearchDialog';
import { useFriends, useFriendRequests, useSentRequests, useBlockedUsers, useFriendActions } from '@/features/friends/hooks/useFriends';
import { Users, Inbox, Send, ShieldBan, Compass, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import Link from 'next/link';

type Tab = 'friends' | 'requests' | 'sent' | 'blocked';

export default function FriendsPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { friends, loading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { requests, loading: requestsLoading, refetch: refetchRequests } = useFriendRequests();
  const { sent, loading: sentLoading, refetch: refetchSent } = useSentRequests();
  const { blocked, loading: blockedLoading, refetch: refetchBlocked } = useBlockedUsers();
  const { acceptRequest, rejectRequest, removeFriend, blockUser, unblockUser } = useFriendActions();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(ROUTES.LOGIN);
      } else {
        setAuthChecking(false);
      }
    });
  }, [router]);

  const handleAccept = async (friendshipId: string) => {
    await acceptRequest(friendshipId);
    toast.success('Friend request accepted!');
    refetchRequests();
    refetchFriends();
  };

  const handleReject = async (friendshipId: string) => {
    await rejectRequest(friendshipId);
    toast.success('Request rejected');
    refetchRequests();
  };

  const handleRemove = async (friendshipId: string) => {
    await removeFriend(friendshipId);
    toast.success('Friend removed');
    refetchFriends();
  };

  const handleBlock = async (profileId: string) => {
    await blockUser(profileId);
    toast.success('User blocked');
    refetchFriends();
    refetchBlocked();
  };

  const handleCancelRequest = async (friendshipId: string) => {
    await removeFriend(friendshipId);
    toast.success('Request cancelled');
    refetchSent();
  };

  const handleUnblock = async (profileId: string) => {
    await unblockUser(profileId);
    toast.success('User unblocked');
    refetchBlocked();
  };

  if (authChecking) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 rounded-3xl" />
        </Container>
      </main>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" />, count: friends.length },
    { key: 'requests', label: 'Requests', icon: <Inbox className="w-4 h-4" />, count: requests.length },
    { key: 'sent', label: 'Sent', icon: <Send className="w-4 h-4" />, count: sent.length },
    { key: 'blocked', label: 'Blocked', icon: <ShieldBan className="w-4 h-4" />, count: blocked.length },
  ];

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <PageHeader title="Friends" subtitle="Manage your gaming connections" />
          <div className="flex gap-2">
            <Button onClick={() => setIsSearchOpen(true)} variant="outline" className="rounded-full">
              <Search className="w-4 h-4 mr-2" />
              Find Friends
            </Button>
            <Button asChild className="rounded-full">
              <Link href={ROUTES.DISCOVER}>
                <Compass className="w-4 h-4 mr-2" />
                Discover Players
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`
                  ml-1 text-xs px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : tab.key === 'requests' && tab.count > 0
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/10 text-muted-foreground'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'friends' && (
          <div>
            {friendsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : friends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((f: any) => (
                  <FriendCard key={f.id} friendship={f} onRemove={handleRemove} onBlock={handleBlock} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Users className="w-12 h-12" />} title="No friends yet" description="Discover new players and send them friend requests!" />
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            {requestsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((r: any) => (
                  <FriendRequestCard key={r.id} request={r} onAccept={handleAccept} onReject={handleReject} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Inbox className="w-12 h-12" />} title="No pending requests" description="When someone sends you a friend request, it'll appear here." />
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div>
            {sentLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            ) : sent.length > 0 ? (
              <div className="space-y-4">
                {sent.map((s: any) => (
                  <SentRequestCard key={s.id} request={s} onCancel={handleCancelRequest} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Send className="w-12 h-12" />} title="No sent requests" description="Friend requests you've sent will appear here." />
            )}
          </div>
        )}

        {activeTab === 'blocked' && (
          <div>
            {blockedLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            ) : blocked.length > 0 ? (
              <div className="space-y-4">
                {blocked.map((b: any) => (
                  <BlockedUserCard key={b.id} block={b} onUnblock={handleUnblock} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<ShieldBan className="w-12 h-12" />} title="No blocked users" description="Users you block will appear here." />
            )}
          </div>
        )}
      </Container>
      <UserSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
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
