import Button from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'

const page = async ({}) => {
	const session = await getAuthSession()

	return (
		<div>
			Dashboard
			<pre>{JSON.stringify(session)}</pre>
			<Button variant={'default'}>Button</Button>
		</div>
	)
}

export default page
