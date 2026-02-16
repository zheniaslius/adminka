import { AppProviders } from '@/app/providers/appProviders'
import { AppRouter } from '@/app/router/AppRouter'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </div>
  )
}

export default App
