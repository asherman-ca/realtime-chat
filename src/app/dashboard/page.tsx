import Button from '@/components/ui/Button'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
	return (
		<div>
			Dashboard <Button variant={'default'}>Button</Button>
		</div>
	)
}

export default page
