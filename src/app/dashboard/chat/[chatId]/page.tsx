import { fetchRedis } from '@/helpers/redis'
import { getAuthSession } from '@/lib/auth'
import { messageArrayValidator } from '@/lib/validations/message'
import { notFound } from 'next/navigation'

async function getChatMessages(chatId: string) {
	try {
		const results: string[] = await fetchRedis(
			'zrange',
			`chat:${chatId}:messages`,
			0,
			-1
		)

		const dbMessages = results.map((message) => JSON.parse(message) as Message)

		const reversedDbMessages = dbMessages.reverse()

		const messages = messageArrayValidator.parse(reversedDbMessages)

		return messages
	} catch (error) {
		notFound()
	}
}

interface pageProps {
	params: {
		chatId: string
	}
}

const page = async ({ params }: pageProps) => {
	const { chatId } = params
	const session = await getAuthSession()
	if (!session) notFound()
	const { user } = session

	const [userId1, userId2] = chatId.split('--')

	if (user.id !== userId1 && user.id !== userId2) notFound()

	const chatPartnerId = user.id === userId1 ? userId2 : userId1
	const chatPartner = (await fetchRedis('get', `user:${chatPartnerId}`)) as User
	const messages = await getChatMessages(chatId)

	return <div>{chatId}</div>
}

export default page
