import { fetchRedis } from '@/helpers/redis'
import { db } from '@/lib/db'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
	adapter: UpstashRedisAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
				| string
				| null

			if (!dbUserResult) {
				if (user) {
					token.id = user!.id
				}

				return token
			}

			const dbUser = JSON.parse(dbUserResult) as User

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			}
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id
				session.user.name = token.name
				session.user.email = token.email
				session.user.image = token.picture
			}

			return session
		},
		redirect() {
			return '/dashboard'
		},
	},
}

export const getAuthSession = () => getServerSession(authOptions)
