import { Link } from '@remix-run/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui'
import { useSessionUser } from '~/hooks/use-session-user'

export const AppLoginPane = () => {
  const user = useSessionUser()

  if (!user) {
    return (
      <div>
        <Button asChild size="sm" type="submit" variant="default">
          <Link to="/auth/google">Sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback>{user.displayName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div>
            <p>{user.displayName}</p>
            <p className="text-xs font-normal">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/auth/logout">Sign Out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
