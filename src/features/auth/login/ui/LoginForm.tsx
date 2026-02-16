import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { observer } from 'mobx-react-lite'

import { useSession } from '@/app/providers/session'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type FormValues = {
  username: string
  password: string
}

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const session = useSession()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
    },
    mode: 'onSubmit',
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      await session.login(values)
      if (session.isAuthenticated) onSuccess()
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          {...register('username', { required: 'Username is required' })}
        />
        {formState.errors.username?.message ? (
          <p className="text-sm text-destructive">
            {formState.errors.username.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password', { required: 'Password is required' })}
        />
        {formState.errors.password?.message ? (
          <p className="text-sm text-destructive">
            {formState.errors.password.message}
          </p>
        ) : null}
      </div>

      {session.error ? (
        <p className="text-sm text-destructive">{session.error}</p>
      ) : null}

      <Button className="w-full" type="submit" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

export const ObservedLoginForm = observer(LoginForm)
