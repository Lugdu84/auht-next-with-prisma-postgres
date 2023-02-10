/* eslint-disable import/no-unresolved */
import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line import/no-extraneous-dependencies
import { JwtPayload } from 'jsonwebtoken'
import dbConnect from '@/lib/connectDb'
import User, { IUser } from '@/models/User'
import { verifyActivationToken } from '@/lib/tokens'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
    const { token } = req.body
    const userToken = verifyActivationToken(token)
    const userDb: IUser | null = await User.findById(
      (userToken as JwtPayload).id
    )
    if (!userDb) {
      return res.status(400).json({ message: "Ce compte n'existe pas" })
    }
    if (userDb.emailVerified) {
      return res
        .status(400)
        .json({ message: 'Vous avez déjà vérifié votre adresse mail' })
    }
    await User.findByIdAndUpdate(userDb.id, {
      emailVerified: true,
    })
    res.status(200).json({
      message:
        'Votre compte a été activé. Vous pouvez maintenant vous connecter et profiter de toutes les fonctionalités du site',
    })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
}
