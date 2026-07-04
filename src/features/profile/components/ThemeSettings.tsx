'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/useTheme';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { AppearanceMode, GenreCategory } from '@/constants/enums';
import { GENRE_THEMES } from '@/config/theme';
import { Sun, Moon, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Human-friendly labels for the genre themes
const THEME_LABELS: Record<GenreCategory, string> = {
  [GenreCategory.RPG]: 'RPG Purple',
  [GenreCategory.Soulslike]: 'Dark Souls Bronze',
  [GenreCategory.Horror]: 'Crimson Horror',
  [GenreCategory.Racing]: 'Rust Orange',
  [GenreCategory.Strategy]: 'Deep Blue',
  [GenreCategory.Simulation]: 'Forest Green',
  [GenreCategory.Shooter]: 'Military Olive',
  [GenreCategory.Adventure]: 'Teal Adventure',
  [GenreCategory.Indie]: 'Indie Magenta',
  [GenreCategory.Platformer]: 'Amber Gold',
  [GenreCategory.Cyberpunk]: 'Cyberpunk Neon',
  [GenreCategory.SciFi]: 'Sci-Fi Cyan',
  [GenreCategory.Retro]: 'Retro Burnt',
};

export function ThemeSettings() {
  const { theme, setTheme, genreTheme, setGenreTheme, setProfileGenre } = useTheme();
  const { profile, updateProfile } = useProfile();
  const [savingTheme, setSavingTheme] = useState<string | null>(null);

  const handleSelectGenreTheme = async (genre: GenreCategory | null) => {
    const genreStr = genre || 'none';
    setSavingTheme(genreStr);
    try {
      await updateProfile({
        favorite_genre: genre,
      });
      setGenreTheme(genre);
      setProfileGenre(genre);
      toast.success(`${genre ? `${THEME_LABELS[genre]} theme` : 'Default theme'} applied!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update favorite theme');
    } finally {
      setSavingTheme(null);
    }
  };

  if (!profile) return null;

  return (
    <Card className="bg-background/40 backdrop-blur-md border border-border shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Theme & Customization
        </CardTitle>
        <CardDescription>
          Customize your dashboard and overall interface appearance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Appearance Section */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold tracking-wide">Appearance Mode</Label>
          <div className="grid grid-cols-2 gap-4">
            {/* Light Mode */}
            <button
              onClick={() => setTheme(AppearanceMode.Light)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                theme === AppearanceMode.Light
                  ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(202,138,4,0.1)]'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted/10'
              }`}
            >
              <Sun className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm">Light Mode</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme(AppearanceMode.Dark)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                theme === AppearanceMode.Dark
                  ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(202,138,4,0.1)]'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted/10'
              }`}
            >
              <Moon className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Accent Presets Section */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold tracking-wide">Genre Accent Themes</Label>
          <p className="text-xs text-muted-foreground mb-4">
            Select an active gaming genre to recolor your interface highlights (buttons, links, badges, and background glows).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
            {/* Default / Minimal Theme Option */}
            <button
              disabled={savingTheme !== null}
              onClick={() => handleSelectGenreTheme(null)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                genreTheme === null
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-transparent hover:bg-muted/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-border bg-muted flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                </div>
                <span className="font-medium text-sm text-foreground">Default Minimal</span>
              </div>
              {savingTheme === 'none' ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                genreTheme === null && <Check className="w-4 h-4 text-primary" />
              )}
            </button>

            {/* Genre Options */}
            {Object.values(GenreCategory).map((genre) => {
              const palette = GENRE_THEMES[genre];
              const isSelected = genreTheme === genre;
              const isSavingThis = savingTheme === genre;

              return (
                <button
                  key={genre}
                  disabled={savingTheme !== null}
                  onClick={() => handleSelectGenreTheme(genre)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-transparent hover:bg-muted/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full border flex items-center justify-center"
                      style={{ 
                        backgroundColor: palette.primary + '20', 
                        borderColor: palette.border 
                      }}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: palette.primary }}
                      />
                    </div>
                    <span className="font-medium text-sm text-foreground">{THEME_LABELS[genre]}</span>
                  </div>
                  {isSavingThis ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    isSelected && <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
