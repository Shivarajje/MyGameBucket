import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0 mt-auto">
      <div className="container mx-auto max-w-[1440px] px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="flex flex-col md:flex-row gap-4 items-center md:gap-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MyGameBucket. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
