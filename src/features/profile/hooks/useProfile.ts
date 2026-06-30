'use client';

import { useState, useEffect } from 'react';
import { DatabaseProfile } from '@/types/database';

export function useProfile() {
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (error) {
        console.error('useProfile error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<DatabaseProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update profile');
      }
      const updated = await res.json();
      setProfile(updated);
      return updated;
    } catch (error) {
      throw error;
    }
  };

  return { profile, loading, updateProfile };
}

export function usePublicProfile(username: string) {
  const [data, setData] = useState<{ profile: DatabaseProfile; stats: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
        if (!res.ok) {
          setError('Profile not found');
          return;
        }
        setData(await res.json());
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (username) fetchProfile();
  }, [username]);

  return { data, loading, error };
}
