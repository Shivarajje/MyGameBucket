'use client';

import { Bell } from 'lucide-react';
import { useNotificationCount } from '../hooks/useFriends';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function NotificationBell() {
  const { count } = useNotificationCount();

  return (
    <Link
      href={ROUTES.FRIENDS}
      className="relative p-2 rounded-full bg-white/5 border border-border hover:bg-white/10 transition-colors"
      title="Friend Requests"
    >
      <Bell className={`w-5 h-5 ${count > 0 ? 'text-primary animate-bell-ring' : 'text-muted-foreground'}`} />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1 animate-bounce-in">
          {count > 9 ? '9+' : count}
        </span>
      )}

      <style jsx global>{`
        @keyframes bell-ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-14deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(6deg); }
          60% { transform: rotate(-6deg); }
          70% { transform: rotate(2deg); }
          80% { transform: rotate(-2deg); }
          90% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-bell-ring {
          animation: bell-ring 1s ease-in-out infinite;
          animation-delay: 0.5s;
          transform-origin: top center;
        }

        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out forwards;
        }
      `}</style>
    </Link>
  );
}
