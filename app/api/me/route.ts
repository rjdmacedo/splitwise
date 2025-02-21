import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.json(user, { status: 200 })
}
