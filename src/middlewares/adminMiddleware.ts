/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

export default function adminMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie:
        process.env.NODE_ENV === 'production' &&
        process.env.NEXTAUTH_URL?.startsWith('https'),
    })
    try {
      if (!session) {
        return res.status(401).json({
          message: 'Vous devez être connecté pour accéder à cette ressource.',
        })
      }
      if (session?.role !== 'ADMIN') {
        return res.status(403).json({
          message: "Vous n'êtes pas autorisé à accéder à cette ressource.",
        })
      }
      return handler(req, res)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}
