/* eslint-disable import/no-unresolved */
import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line import/no-extraneous-dependencies
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/connectDb'
import User, { IUser } from '@/models/User'
import { verifyResetToken } from '@/lib/tokens'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
    const { token, password } = req.body
    const userToken = verifyResetToken(token)
    const userDb: IUser | null = await User.findById(
      (userToken as JwtPayload).id
    )
    if (!userDb) {
      return res.status(400).json({ message: "Ce compte n'existe pas" })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Le mot de passe doit avoir au moins 6 caractères' })
    }
    const cryptedPassword = await bcrypt.hash(password, 12)
    // eslint-disable-next-line no-underscore-dangle
    await User.findByIdAndUpdate(userDb._id, {
      password: cryptedPassword,
    })
    res.status(200).json({
      message:
        'Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe',
    })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
}
