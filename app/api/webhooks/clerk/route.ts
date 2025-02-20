import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, getUserById, updateUser } from '@/lib/users'
import { User } from '@prisma/client'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers
  const headersList = await headers()
  const svix_id = headersList.get('svix-id')
  const svix_timestamp = headersList.get('svix-timestamp')
  const svix_signature = headersList.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  const eventType = evt.type

  switch (eventType) {
    case 'user.created': {
      const { id, username, first_name, last_name, image_url } = evt.data

      if (!id || !username) {
        return new Response('Error occurred -- missing data', {
          status: 400
        })
      }

      const data = {
        username,
        clerkUserId: id,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {})
      } as User

      await createUser(data)
      break
    }
    case 'user.updated': {
      const { id, username, first_name, last_name, image_url } = evt.data

      if (!id || !username) {
        return new Response('Error occurred -- missing data', {
          status: 400
        })
      }

      const data = {
        username,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {})
      } as User

      const { user } = await getUserById({ clerkUserId: id })

      if (!user) {
        return new Response('Error occurred -- user not found', {
          status: 404
        })
      }

      await updateUser(user.id, data)
      break
    }
    default:
      break
  }

  return new Response('', { status: 200 })
}
