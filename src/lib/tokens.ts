import jwt from 'jsonwebtoken'

const { ACTIVATION_TOKEN_SECRET, RESET_TOKEN_SECRET } = process.env

export const createActivationToken = (payload: any) =>
  jwt.sign(payload, ACTIVATION_TOKEN_SECRET as string, {
    expiresIn: '1d',
  })

export const createResetToken = (payload: any) =>
  jwt.sign(payload, RESET_TOKEN_SECRET as string, {
    expiresIn: '1d',
  })