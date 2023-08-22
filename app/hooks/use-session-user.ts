import { useRouteLoaderData } from '@remix-run/react'
import type { SessionUser } from '~/services/session.server'

export const useSessionUser = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rootRouteData = useRouteLoaderData('root')
  const { user } = rootRouteData as { user?: SessionUser }
  return user
}
