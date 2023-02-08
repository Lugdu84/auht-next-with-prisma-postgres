import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import TwitterProvider from 'next-auth/providers/twitter'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import clientPromise from '@/lib/mongodb'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: JWT
      user?: User | AdapterUser | undefined
      account?: Account | null | undefined
      profile?: Profile | undefined
      isNewUser?: boolean | undefined
    }) {
      console.log('account in callback', account)
      console.log('profile in callback', profile)
      console.log('user in callback', user)
      console.log('token in callback', token)
      console.log('isNewUser in callback', isNewUser)
      const updatedToken = { ...token }
      if (user) {
        updatedToken.provider = account?.provider
        updatedToken.role = user.role
      }
      return updatedToken
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('session in callback', session)
      const updatedSession = { ...session }
      if (session.user) {
        updatedSession.user.provider = token.provider as string
        updatedSession.user.id = token.sub as string
        updatedSession.user.role = token.role as string
      }
      return updatedSession
    },
  },
})
