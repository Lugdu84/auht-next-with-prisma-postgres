import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prismadb'

// eslint-disable-next-line consistent-return
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  const { id } = req.query
  const { userId } = req.body
  switch (method) {
    case 'GET':
      try {
        res.status(200).json({ name: 'John Doe' })
      } catch (error) {
        res.status(500).json({ error })
      }
      break
    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ message: "'Liste introuvable'" })
        }
        const listeToDelete = await prisma.list.delete({
          where: {
            id: id as string,
          },
        })
        if (!listeToDelete) {
          return res.status(400).json({ message: "'Liste introuvable'" })
        }
        const userAfterDelete = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            lists: {
              disconnect: {
                id: id as string,
              },
            },
          },
        })
        res.status(200).json(userAfterDelete)
      } catch (error) {
        res.status(500).json({ error })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
