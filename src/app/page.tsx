import React from 'react';
import { ArrowRight, Play, Trophy, Crown, Gamepad2, Monitor, Joystick, Ghost, Shield, Swords } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans min-h-screen flex items-center">
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-fade-in {
            animation: fadeSlideIn 0.8s ease-out forwards;
            opacity: 0;
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
        `}</style>

        {/* Background Radial Glow */}
        <div className="absolute inset-0 z-0 bg-zinc-950">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] opacity-50" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] opacity-40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 md:pt-40 md:pb-20 lg:px-8 w-full">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              
              <h1 
                className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9]"
                style={{
                  maskImage: 'linear-gradient(180deg, black 0%, black 80%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 80%, transparent 100%)'
                }}
              >
                Your Gaming<br />
                <span className="bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(202,138,4,0.3)]">
                  Journey
                </span><br />
                Preserved.
              </h1>

              <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4 mt-4">
                <Link href={ROUTES.REGISTER} className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] shadow-[0_0_20px_rgba(202,138,4,0.4)]">
                  Start Your Journal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link href={ROUTES.LOGIN} className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                  <Play className="w-4 h-4 fill-current" />
                  Log In
                </Link>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight text-white">2.5M+</div>
                      <div className="text-sm text-zinc-400">Games Indexed</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">System Reliability</span>
                      <span className="text-white font-medium">99.9%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                      <div className="h-full w-[99.9%] rounded-full bg-gradient-to-r from-white to-primary shadow-[0_0_10px_rgba(202,138,4,0.8)]" />
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <StatItem value="13" label="Genres" />
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <StatItem value="Sync" label="Real-time" />
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <StatItem value="Free" label="Forever" />
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      IGDB ACTIVE
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium tracking-wide text-primary backdrop-blur-md">
                      <Crown className="w-3 h-3 text-primary" />
                      PREMIUM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
