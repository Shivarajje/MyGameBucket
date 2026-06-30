import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-9xl font-bold tracking-tighter text-muted">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2 tracking-tight">Game Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        It looks like this path is a dead end. Let's return to the main menu.
      </p>
      <Button asChild size="lg">
        <Link href={ROUTES.HOME}>Return to Home</Link>
      </Button>
    </div>
  );
}
