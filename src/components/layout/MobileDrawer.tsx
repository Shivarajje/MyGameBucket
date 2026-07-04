'use client';

import { X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export function MobileDrawer({ isOpen, onClose, links }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden flex flex-col">
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2" onClick={onClose}>
          <span className="font-bold inline-block text-xl tracking-tight">MyGameBucket</span>
        </Link>
        <button className="p-2" onClick={onClose} aria-label="Close menu">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <nav className="flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-foreground/80",
                pathname?.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              href={ROUTES.SETTINGS}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-foreground/80",
                pathname === ROUTES.SETTINGS ? "text-foreground" : "text-foreground/60"
              )}
            >
              Settings
            </Link>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          {user ? (
            <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full justify-center" asChild onClick={onClose}>
                <Link href={ROUTES.LOGIN}>Log in</Link>
              </Button>
              <Button className="w-full justify-center" asChild onClick={onClose}>
                <Link href={ROUTES.REGISTER}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

