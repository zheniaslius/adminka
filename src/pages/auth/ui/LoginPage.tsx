import { useNavigate, useLocation } from 'react-router-dom'

import { ObservedLoginForm } from '@/features/auth/login/ui/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

type LocationState = { from?: string }

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <CardDescription>
            DummyJSON auth with token saved in localStorage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ObservedLoginForm
            onSuccess={() => navigate(state.from ?? '/products', { replace: true })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
