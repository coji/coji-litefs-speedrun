import { Link } from '@remix-run/react'
import { Heading, Spacer } from '~/components/ui'
import { AppLoginPane } from './AppLoginPane'

export const AppHeader = () => {
  return (
    <header className="flex items-center bg-background py-1 text-foreground">
      <div className="container flex">
        <Heading>
          <Link to="/">App</Link>
        </Heading>
        <Spacer />
        <AppLoginPane />
      </div>
    </header>
  )
}
