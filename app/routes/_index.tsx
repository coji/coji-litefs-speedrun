import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { useEffect } from 'react'
import { z } from 'zod'
import { zx } from 'zodix'
import { AppFooter, AppHeader } from '~/components'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  HStack,
  Input,
  Stack,
} from '~/components/ui'
import { addMessage, deleteAllMessages, listMessages } from '~/models/message.server'

export const loader = async (args: LoaderArgs) => {
  const messages = await listMessages()
  const machineId = process.env.FLY_MACHINE_ID
  return json({ messages, machineId })
}

export const action = async ({ request }: ActionArgs) => {
  const { message, intent } = await zx.parseForm(
    request,
    z.object({ message: z.string(), intent: z.enum(['send', 'reset']) }),
  )
  const machineId = process.env.FLY_MACHINE_ID

  if (intent === 'send') {
    await addMessage({
      text: message,
      machine: machineId,
    })
    return json({})
  }

  if (intent === 'reset') {
    await deleteAllMessages()
    return json({})
  }

  return json({})
}

export default function IndexPage() {
  const { messages, machineId } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'submitting') {
      const form = document.getElementById('form') as HTMLFormElement | null
      form?.reset()
      document.getElementById('message')?.focus()
    }
  }, [navigation.state])

  return (
    <div className="flex h-screen flex-col bg-slate-200">
      <AppHeader>
        <HStack>
          <Badge>{machineId ?? 'unknown'}</Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Reset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Are you sure?</DialogHeader>
              <DialogFooter>
                <Button variant="destructive" form="form" name="intent" value="reset">
                  Reset Database
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </HStack>
      </AppHeader>

      <main className="container mx-auto flex flex-1 flex-col py-2">
        <Stack className="flex-1 flex-col">
          <Stack className="flex-1">
            {messages.map((message) => {
              return (
                <div key={message.id} className="flex items-center gap-4 rounded bg-background px-4 py-2">
                  <div className="flex-1">{message.text}</div>
                  <div className="text-sm text-slate-500">{message.createdAt}</div>
                  <div>
                    <Badge variant={machineId === message.machine ? 'default' : 'outline'}>
                      {message.machine ?? 'unknown'}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </Stack>

          <Form id="form" method="POST">
            <HStack>
              <Input autoFocus id="message" name="message" placeholder="Type your message here." />
              <Button name="intent" value="send">
                Send
              </Button>
            </HStack>
          </Form>
        </Stack>
      </main>

      <AppFooter />
    </div>
  )
}
