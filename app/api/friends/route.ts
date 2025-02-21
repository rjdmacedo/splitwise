import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const friends = await prisma.userFriend.findMany({
    where: { userId },
    include: { friend: true }
  })

  return NextResponse.json(
    friends.map(f => f.friend),
    { status: 200 }
  )
}
