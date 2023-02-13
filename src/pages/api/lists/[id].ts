import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line import/no-unresolved
import List from '@/models/List'
// eslint-disable-next-line import/no-unresolved
import User from '@/models/User'

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
        await List.findByIdAndDelete(id)
        const userAfterDelete = await User.findByIdAndUpdate(userId, {
          $pull: { lists: id },
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
