import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/auth/user.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
  },
  { timestamps: true }
)

export interface IUser {
  _id: string
  name: string
  image: string
  email: string
  password: string
  phone: string
  role: string
  emailVerified: boolean
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
