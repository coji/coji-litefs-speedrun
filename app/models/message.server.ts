import type { Prisma } from '@prisma/client'
import { prisma } from '~/services/database.server'

export const listMessages = async (take = 10) => {
  return await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  })
}

export const deleteAllMessages = async () => {
  return await prisma.message.deleteMany()
}

export const addMessage = async (data: Prisma.MessageCreateInput) => {
  return await prisma.message.create({ data })
}
