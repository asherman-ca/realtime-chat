import Providers from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Realtime Chat',
	description: 'Welcome to Realtime Chat',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
