import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    business: String,
    email: {
      type: String,
      required: true,
    },
    IDNumber: Number,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    password: String,
    activated: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    collection: "users"
  }
)

export const getUserById = async (id) => {
  try {
    const user = await this.findOne({ _id: id })
    return user
  } catch (error) {
    throw error
  }
}

export const createUser = async (newUser) => {
  try {
    const user = await this.create(newUser)
    return user
  } catch (error) {
    throw error
  }
}

export default mongoose.model("User", userSchema)
