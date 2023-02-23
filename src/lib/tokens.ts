import jwt from 'jsonwebtoken'

type IPayload = string | Buffer | object

const { ACTIVATION_TOKEN_SECRET, RESET_TOKEN_SECRET } = process.env

export const createActivationToken = (payload: IPayload) =>
  jwt.sign(payload, ACTIVATION_TOKEN_SECRET as string, {
    expiresIn: '1d',
  })

export const createResetToken = (payload: IPayload) =>
  jwt.sign(payload, RESET_TOKEN_SECRET as string, {
    expiresIn: '1d',
  })

export const verifyResetToken = (token: string) =>
  jwt.verify(token, RESET_TOKEN_SECRET as string)

export const verifyActivationToken = (token: string) =>
  jwt.verify(token, ACTIVATION_TOKEN_SECRET as string)
