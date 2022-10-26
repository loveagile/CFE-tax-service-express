import mongoose, { Schema } from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    created_at: Date,
  }
)

export default mongoose.model("Category", categorySchema)
