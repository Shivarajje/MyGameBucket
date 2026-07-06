'use client';

import { Button } from '@/components/ui/button';
import { useFriendshipStatus, useFriendActions } from '../hooks/useFriends';
import { UserPlus, UserCheck, Clock, Check, X, Ban, Loader2, ShieldOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FriendshipButtonProps {
  profileId: string;
  className?: string;
}

export function FriendshipButton({ profileId, className }: FriendshipButtonProps) {
  const { status, friendshipId, loading, refetch } = useFriendshipStatus(profileId);
  const { sendRequest, acceptRequest, rejectRequest, removeFriend, blockUser, unblockUser, actionLoading } = useFriendActions();
  const [showMenu, setShowMenu] = useState(false);

  if (loading) return null;
  if (status === 'self') return null;

  const handleSendRequest = async () => {
    try {
      await sendRequest(profileId);
      toast.success('Friend request sent!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    }
  };

  const handleAccept = async () => {
    if (!friendshipId) return;
    try {
      await acceptRequest(friendshipId);
      toast.success('Friend request accepted!');
      refetch();
    } catch {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async () => {
    if (!friendshipId) return;
    try {
      await rejectRequest(friendshipId);
      toast.success('Request rejected');
      refetch();
    } catch {
      toast.error('Failed to reject request');
    }
  };

  const handleRemove = async () => {
    if (!friendshipId) return;
    try {
      await removeFriend(friendshipId);
      toast.success('Friend removed');
      refetch();
    } catch {
      toast.error('Failed to remove friend');
    }
    setShowMenu(false);
  };

  const handleBlock = async () => {
    try {
      await blockUser(profileId);
      toast.success('User blocked');
      refetch();
    } catch {
      toast.error('Failed to block user');
    }
    setShowMenu(false);
  };

  const handleUnblock = async () => {
    try {
      await unblockUser(profileId);
      toast.success('User unblocked');
      refetch();
    } catch {
      toast.error('Failed to unblock user');
    }
  };

  if (status === 'blocked') {
    return (
      <Button
        variant="outline"
        className={`rounded-full ${className}`}
        onClick={handleUnblock}
        disabled={actionLoading}
      >
        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldOff className="w-4 h-4 mr-2" />}
        Unblock
      </Button>
    );
  }

  if (status === 'blocked_by_them') {
    return null; // Don't show anything
  }

  if (status === 'none') {
    return (
      <div className="flex gap-2">
        <Button
          className={`rounded-full ${className}`}
          onClick={handleSendRequest}
          disabled={actionLoading}
        >
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          Add Friend
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground hover:text-destructive"
          onClick={handleBlock}
          disabled={actionLoading}
          title="Block user"
        >
          <Ban className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (status === 'request_sent') {
    return (
      <Button
        variant="outline"
        className={`rounded-full cursor-default ${className}`}
        disabled
      >
        <Clock className="w-4 h-4 mr-2" />
        Request Sent
      </Button>
    );
  }

  if (status === 'request_received') {
    return (
      <div className="flex gap-2">
        <Button className={`rounded-full ${className}`} onClick={handleAccept} disabled={actionLoading}>
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
          Accept
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={handleReject} disabled={actionLoading}>
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>
    );
  }

  // status === 'friends'
  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`rounded-full border-primary/30 text-primary ${className}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <UserCheck className="w-4 h-4 mr-2" />
        Friends
      </Button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-40 rounded-xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" /> Unfriend
            </button>
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/5 text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
              onClick={handleBlock}
            >
              <Ban className="w-4 h-4" /> Block
            </button>
          </div>
        </>
      )}
    </div>
  );
}
