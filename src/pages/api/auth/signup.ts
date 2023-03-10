/* eslint-disable import/no-unresolved */
import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prismadb'

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (user) {
      return res.status(400).json({ message: 'Ce compte existe déjà' })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Le mot de passe doit avoir au moins 6 caractères' })
    }
    // Pour voir les changements dans la base de données
    // User.watch().on('change', (data) => console.log(data))
    const cryptedPassword = await bcrypt.hash(password, 12)
    const name = `${firstName} ${lastName}`

    // await User.create({
    //   name,
    //   email,
    //   password: cryptedPassword,
    //   phone,
    // })
    await prisma.user.create({
      data: {
        name,
        email,
        password: cryptedPassword,
        emailVerified: new Date(),
      },
    })
    // const list = await List.create({
    //   name: `La  première liste de ${name} `,
    //   user: newUser,
    // })
    // newUser.lists.push(list)
    // newUser.save()
    // const newUserWithList = await User.findOne({ email }).populate('lists')
    // console.log('newUser in signup after push', newUserWithList)
    // eslint-disable-next-line no-underscore-dangle
    // await newUser.save()
    // Desactiver l'envoi de mail pour l'instant
    // const activationToken = createActivationToken({
    //   // eslint-disable-next-line no-underscore-dangle
    //   id: newUser._id.toString(),
    // })
    // const url = `${process.env.NEXTAUTH_URL}/activate/${activationToken}`
    // await sendMail(
    //   email,
    //   name,
    //   '',
    //   url,
    //   'Activez votre compte',
    //   activateTemplateEmail
    // )

    return res.status(201).json({
      message: 'Votre compte a été créé avec succès',
    })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
}
