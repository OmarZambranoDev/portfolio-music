import { vi } from 'vitest';

vi.mock('@portfolio/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@portfolio/ui')>();
  return {
    ...actual,
    useToast: () => ({
      toast: vi.fn(),
    }),
  };
});