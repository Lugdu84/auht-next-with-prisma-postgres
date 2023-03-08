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
          return res
            .status(400)
            .json({ message: 'Le paramètre liste est obligatoire' })
        }
        const list = await prisma.list.findUnique({
          where: {
            id: id as string,
          },
          select: {
            userId: true,
          },
        })

        if (!list || list.userId !== userId) {
          res.status(400).json({
            message: "Cette liste n'existe pas ou vous ne vous appartient pas ",
          })
        }

        await prisma.list.delete({
          where: {
            id: id as string,
          },
        })
        res.status(200).json({ message: 'Liste supprimée avec succès' })
      } catch (error) {
        res.status(500).json({ error })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
