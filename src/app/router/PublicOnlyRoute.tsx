import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router-dom'

import { useSession } from '@/app/providers/session'

export const PublicOnlyRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    const session = useSession()

    if (!session.ready) return children

    if (session.isAuthenticated) {
      return <Navigate to="/products" replace />
    }

    return children
  },
)

