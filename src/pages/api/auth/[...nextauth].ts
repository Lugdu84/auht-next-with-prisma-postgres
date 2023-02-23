/* eslint-disable import/no-unresolved */
import NextAuth, { Account, Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { JWT } from 'next-auth/jwt'
// eslint-disable-next-line import/no-unresolved
import { AdapterUser } from 'next-auth/adapters'
import bcrypt from 'bcrypt'
import clientPromise from '@/lib/mongodb'
import dbConnect from '@/lib/connectDb'
import MongoDbUser from '@/models/User'

export default NextAuth({
  // adapter: for MongodDB and providers: for social login
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'exemple@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await MongoDbUser.findOne({
          email: credentials?.email,
        })
        if (!user) {
          throw new Error('Mot de passe ou adresse email incorrect')
        }
        if (user.emailVerified === null) {
          throw new Error('Veuillez vous connecter avec votre compte Google')
        }
        const isPasswordValid = await bcrypt.compare(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          credentials!.password,
          user.password
        )
        if (!isPasswordValid) {
          throw new Error('Mot de passe ou adresse email incorrect')
        }
        // Deactivated because we don't need email verification
        // if (!user.emailVerified) {
        //   throw new Error(
        //     'Veuillez activez votre compte, en cliquant sur le lien envoyé par mail'
        //   )
        // }
        return user
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT
      user?: User | AdapterUser | undefined
      account?: Account | null | undefined
    }) {
      const updatedToken = { ...token }
      if (user) {
        updatedToken.provider = account?.provider
        updatedToken.role = user.role
      }
      return updatedToken
    },
    async session({ session, token }: { session: Session; token: JWT }) {
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
