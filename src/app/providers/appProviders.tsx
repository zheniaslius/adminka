import { SessionProvider } from '@/app/providers/session'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

