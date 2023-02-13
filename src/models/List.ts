import mongoose, { Schema } from 'mongoose'

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      onDelete: 'CASCADE',
      required: true,
    },
  },
  { timestamps: true }
)

export interface IList {
  id: string
  name: string
  user: string
}

const List = mongoose.models.List || mongoose.model('List', listSchema)

export default List
