import { useState } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile] = useState(() => window.innerWidth < breakpoint);

  return isMobile;
}
