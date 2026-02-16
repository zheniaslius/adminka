import { observer } from 'mobx-react-lite'
import { Navigate, useLocation } from 'react-router-dom'

import { useSession } from '@/app/providers/session'

export const ProtectedRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const session = useSession()
    const location = useLocation()

    if (!session.ready) {
      return (
        <div className="min-h-screen p-6 text-sm text-muted-foreground">
          Loading…
        </div>
      )
    }

    if (!session.isAuthenticated) {
      const from = `${location.pathname}${location.search}`
      return <Navigate to="/login" replace state={{ from }} />
    }

    return children
  },
)

