/* eslint-disable import/no-unresolved */
import { NextApiRequest, NextApiResponse } from 'next'
// eslint-disable-next-line import/no-extraneous-dependencies
import dbConnect from '@/lib/connectDb'
import User, { IUser } from '@/models/User'
import { createResetToken } from '@/lib/tokens'
import sendMail from '@/lib/sendMail'
import resetPasswordTemplate from '@/emailTemplates/reset'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
    const { email } = req.body

    const user: IUser | null = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Ce compte n'existe pas" })
    }
    const userId = createResetToken({
      // eslint-disable-next-line no-underscore-dangle
      id: user._id.toString(),
    })
    const url = `${process.env.NEXTAUTH_URL}/reset/${userId}`
    await sendMail(
      email,
      user.name,
      user.image,
      url,
      'Réinitialisation de votre mot de passe - EatBetter',
      resetPasswordTemplate
    )

    res.status(200).json({
      message:
        'Un mail de réinitialisation de mot de passe a été envoyé à votre adresse mail',
    })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
}
