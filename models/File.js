import mongoose, { Schema } from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    uploaded_at: Date,
    downloaded_at: Date,
    expiration_at: Date,
  }
)

export default mongoose.model("File", fileSchema)
