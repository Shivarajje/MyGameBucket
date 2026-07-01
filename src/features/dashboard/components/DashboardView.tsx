'use client';

import React, { useState, useEffect } from 'react';
import { DatabaseProfile } from '@/types/database';
import { UserGameWithCatalog } from '@/services/libraryRepository';
import { LibraryCard } from '@/features/library/components/LibraryCard';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Activity, Gamepad2, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  profile: DatabaseProfile;
  recentGames: UserGameWithCatalog[];
}

const USERNAME_STYLES = [
  // Cyberpunk Pixel
  "font-mono tracking-widest text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] uppercase",
  // Vaporwave Gradient
  "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 font-black drop-shadow-lg",
  // Glassmorphism
  "text-white/70 backdrop-blur-md border border-white/20 bg-white/5 px-4 py-1 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)]",
  // Royal Gold
  "text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 font-serif italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
  // Pop Art Shadow
  "font-extrabold text-white drop-shadow-[3px_3px_0_rgba(225,29,72,1)] -rotate-2 inline-block",
  // Neon Blue
  "text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] tracking-tight",
];

export function DashboardView({ profile, recentGames }: DashboardViewProps) {
  const [styleIndex, setStyleIndex] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Pick a random style index on client mount to avoid hydration mismatch
    setStyleIndex(Math.floor(Math.random() * USERNAME_STYLES.length));
    setMounted(true);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-zinc-950 text-white font-sans pt-24 pb-12 overflow-hidden">
      {/* Background glow specific to dashboard */}
      <div className="absolute inset-0 z-0 bg-zinc-950 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md mt-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white flex items-center flex-wrap gap-x-3 gap-y-2">
              Welcome back,
              {mounted ? (
                <span className={`transition-all duration-700 ${USERNAME_STYLES[styleIndex]}`}>
                  {profile.username}
                </span>
              ) : (
                <span className="text-transparent opacity-0">{profile.username}</span> // placeholder to preserve layout
              )}
            </h1>
            <p className="text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Ready to continue your gaming journey?
            </p>
          </div>
          
          <Link href={ROUTES.SEARCH} className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 shadow-[0_0_15px_rgba(202,138,4,0.3)]">
            <Gamepad2 className="w-4 h-4" />
            Discover Games
          </Link>
        </section>

        {/* Recent Games Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recently Added
            </h2>
            <Link href={ROUTES.LIBRARY} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
              View Full Library 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {recentGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recentGames.map((game) => (
                <LibraryCard key={game.id} entry={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Gamepad2 className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your library is empty</h3>
              <p className="text-zinc-400 text-center max-w-sm mb-6">
                Start adding games to your library to track your progress and build your collection.
              </p>
              <Link href={ROUTES.SEARCH} className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105">
                Search Games
              </Link>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
