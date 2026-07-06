'use client';

import { useState, useEffect, useCallback } from 'react';

// --- Friends list ---
export function useFriends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends');
      if (res.ok) setFriends(await res.json());
    } catch (error) {
      console.error('useFriends error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFriends(); }, [fetchFriends]);

  return { friends, loading, refetch: fetchFriends };
}

// --- Pending incoming requests ---
export function useFriendRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/requests');
      if (res.ok) setRequests(await res.json());
    } catch (error) {
      console.error('useFriendRequests error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return { requests, loading, refetch: fetchRequests };
}

// --- Sent requests ---
export function useSentRequests() {
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/sent');
      if (res.ok) setSent(await res.json());
    } catch (error) {
      console.error('useSentRequests error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSent(); }, [fetchSent]);

  return { sent, loading, refetch: fetchSent };
}

// --- Blocked users ---
export function useBlockedUsers() {
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocked = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/block');
      if (res.ok) setBlocked(await res.json());
    } catch (error) {
      console.error('useBlockedUsers error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  return { blocked, loading, refetch: fetchBlocked };
}

// --- Friendship status for a specific profile ---
export function useFriendshipStatus(profileId: string | null) {
  const [status, setStatus] = useState<{
    status: 'none' | 'friends' | 'request_sent' | 'request_received' | 'blocked' | 'blocked_by_them' | 'self';
    friendshipId: string | null;
    isRequester: boolean;
  }>({ status: 'none', friendshipId: null, isRequester: false });
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!profileId) { setLoading(false); return; }
    try {
      setLoading(true);
      const res = await fetch(`/api/friends/status/${profileId}`);
      if (res.ok) setStatus(await res.json());
    } catch (error) {
      console.error('useFriendshipStatus error:', error);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  return { ...status, loading, refetch: fetchStatus };
}

// --- Notification count ---
export function useNotificationCount() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/friends/notifications');
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  return { count, refetch: fetchCount };
}

// --- Friend actions ---
export function useFriendActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const sendRequest = async (targetProfileId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetProfileId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send request');
      }
      return await res.json();
    } finally {
      setActionLoading(false);
    }
  };

  const acceptRequest = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });
      if (!res.ok) throw new Error('Failed to accept request');
      return await res.json();
    } finally {
      setActionLoading(false);
    }
  };

  const rejectRequest = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      if (!res.ok) throw new Error('Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const removeFriend = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove friend');
    } finally {
      setActionLoading(false);
    }
  };

  const blockUser = async (targetProfileId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/friends/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetProfileId }),
      });
      if (!res.ok) throw new Error('Failed to block user');
    } finally {
      setActionLoading(false);
    }
  };

  const unblockUser = async (profileId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/friends/block/${profileId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to unblock user');
    } finally {
      setActionLoading(false);
    }
  };

  return { sendRequest, acceptRequest, rejectRequest, removeFriend, blockUser, unblockUser, actionLoading };
}

// --- Discover profiles ---
export function useDiscoverProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/discover');
      if (res.ok) setProfiles(await res.json());
    } catch (error) {
      console.error('useDiscoverProfiles error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  return { profiles, loading, refresh: fetchProfiles };
}
