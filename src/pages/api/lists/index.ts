import { NextApiResponse, NextApiRequest } from 'next'
// eslint-disable-next-line import/no-unresolved
import List from '@/models/List'
// eslint-disable-next-line import/no-unresolved
import User from '@/models/User'

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
          const newList = await List.create({
            name,
            user: userId,
          })
          const user = await User.findByIdAndUpdate(
            userId,
            {
              // eslint-disable-next-line no-underscore-dangle
              $push: { lists: newList._id },
            },
            { new: true }
          )
          await user.save()

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
