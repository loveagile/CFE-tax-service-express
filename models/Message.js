import mongoose, { Schema } from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sent_at: Date,
})

export default mongoose.model('Message', messageSchema)
