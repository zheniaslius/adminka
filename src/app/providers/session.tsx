import { createContext, useContext, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'

import { SessionStore } from '@/entities/session'

const SessionContext = createContext<SessionStore | null>(null)

export function useSession(): SessionStore {
  const store = useContext(SessionContext)
  if (!store) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return store
}

export const SessionProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const store = useMemo(() => new SessionStore(), [])

    useEffect(() => {
      void store.hydrate()
    }, [store])

    return (
      <SessionContext.Provider value={store}>{children}</SessionContext.Provider>
    )
  },
)

