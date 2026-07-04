'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseProfile } from '@/types/database';
import { GenreCategory } from '@/constants/enums';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  profile: DatabaseProfile;
  onSave: (updates: Partial<DatabaseProfile>) => Promise<any>;
}

export function ProfileEditForm({ profile, onSave }: ProfileEditFormProps) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [favoriteGenre, setFavoriteGenre] = useState(profile.favorite_genre || '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        username,
        bio: bio || null,
        favorite_genre: (favoriteGenre || null) as any,
      });
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="bg-background/40 backdrop-blur-md border border-border">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              minLength={3}
              maxLength={30}
              required
              className="rounded-full"
            />
            <p className="text-xs text-muted-foreground">3-30 characters. This is your public identity.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short description about you..."
              maxLength={100}
              rows={2}
              className="rounded-2xl resize-none"
            />
            <p className="text-xs text-muted-foreground">{bio.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Favorite Genre</Label>
            <Select value={favoriteGenre} onValueChange={setFavoriteGenre}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Select your favorite genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {Object.values(GenreCategory).map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
