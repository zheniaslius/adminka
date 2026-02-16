import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

import { useSession } from '@/app/providers/session'
import { Button } from '@/shared/ui/button'

export const LogoutButton = observer(() => {
  const session = useSession()
  const navigate = useNavigate()

  return (
    <Button
      variant="secondary"
      onClick={() => {
        session.logout()
        navigate('/login', { replace: true })
      }}
    >
      Logout
    </Button>
  )
})

