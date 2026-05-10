import { vi } from 'vitest';

vi.mock('@OmarZambranoDev/portfolio-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@OmarZambranoDev/portfolio-ui')>();
  return {
    ...actual,
    useToast: () => ({
      toast: vi.fn(),
    }),
  };
});
