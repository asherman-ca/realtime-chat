import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { z } from 'zod'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const session = await getAuthSession()

		if (!session) {
			return new Response('Unauthorized', { status: 401 })
		}

		const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

		await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

		await pusherServer.trigger(
			toPusherKey(`user:${session.user.id}:friends`),
			'new_friend',
			'beans'
		)

		// await Promise.all([
		// 	pusherServer.trigger(
		// 		toPusherKey(`user:${session.user.id}:friends`),
		// 		'new_friend',
		// 		'beans'
		// 	),
		// 	pusherServer.trigger(
		// 		toPusherKey(`user:${idToDeny}:friends`),
		// 		'new_friend',
		// 		'beans'
		// 	),
		// ])

		return new Response('OK')
	} catch (error) {
		console.log(error)

		if (error instanceof z.ZodError) {
			return new Response('Invalid request payload', { status: 422 })
		}

		return new Response('Invalid request', { status: 400 })
	}
}
