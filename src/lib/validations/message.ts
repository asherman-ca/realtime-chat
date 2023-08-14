import { z } from 'zod'

export const messageValidator = z.object({
	id: z.string(),
	senderId: z.string(),
	text: z.string(),
	timestamp: z.number(),
})

// this lets us validate an array of messages
export const messageArrayValidator = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>
