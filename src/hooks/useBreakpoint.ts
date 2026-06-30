import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint: number): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const checkBreakpoint = () => setIsAboveBreakpoint(window.innerWidth >= breakpoint);
    
    // Initial check
    checkBreakpoint();

    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

export function useIsMobile() {
  return !useBreakpoint(768); // Typical md breakpoint
}
