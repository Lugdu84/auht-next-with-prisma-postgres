/* eslint-disable import/no-unresolved */
import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/connectDb'
import User from '@/models/User'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
    console.log('req.body', req.body)
    const { firstName, lastName, email, password, phone } = req.body
    if (!firstName || !lastName || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: 'Veuillez entrer tous les champs obligatoire' })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Entrez une adresse mail valide' })
    }
    if (!/^0[67]([-. ]?[0-9]{2}){4}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: 'Entrez un numéro de téléphone valide' })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Ce compte existe déjà' })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Le mot de passe doit avoir au moins 6 caractères' })
    }
    const cryptedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: cryptedPassword,
      phone,
    })
    await newUser.save()
    return res.status(201).json({
      message: 'Votre compte a été créé avec succès. Activez-le pour continuer',
    })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
}
