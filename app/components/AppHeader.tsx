import { Link } from '@remix-run/react'
import { Heading } from '~/components/ui'

export const AppHeader = ({ children }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <header className="flex items-center bg-background py-1 text-foreground">
      <div className="container flex items-center">
        <Heading className="flex-1">
          <Link to="/">LiteFS Message Board</Link>
        </Heading>

        <div>{children}</div>
      </div>
    </header>
  )
}
