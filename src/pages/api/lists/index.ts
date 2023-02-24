import { NextApiResponse, NextApiRequest } from 'next'

import prisma from '@/lib/prismadb'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req
    const { userId, name } = req.body
    switch (method) {
      case 'GET':
        // Get data from your database
        res.status(200).json({ name: 'John Doe' })
        break
      case 'POST':
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: userId,
            },
          })
          if (!user) {
            return res.status(400).json({ message: 'Utilisateur introuvable' })
          }
          const newList = await prisma.list.create({
            data: {
              name,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          })
          res.status(200).json(newList)
        } catch (error) {
          res.status(500).json({ message: error.message })
        }

        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
