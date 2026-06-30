'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';
import { SearchBar } from '@/features/search/components/SearchBar';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Games', href: ROUTES.SEARCH },
    { name: 'Library', href: ROUTES.LIBRARY },
    { name: 'Collections', href: ROUTES.COLLECTIONS },
  ];

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex h-16 items-center justify-between rounded-full bg-background/60 backdrop-blur-xl border border-white/10 px-6 shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-6">
        
        {/* Logo and Desktop Links */}
        <div className="flex gap-6 md:gap-10">
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <span className="font-bold inline-block text-xl tracking-tight">MyGameBucket</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname?.startsWith(link.href) ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-sm px-6">
          <SearchBar />
        </div>

        {/* Desktop Auth / Profile Actions Placeholder */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={ROUTES.LOGIN}>Log in</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.REGISTER}>Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </header>
  );
}
