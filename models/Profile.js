import mongoose, { Schema } from 'mongoose'

const profileSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  tax_ssn: String,
  tax_firstname: String,
  tax_lastname: String,
  tax_phone: String,
  tax_email: String,
  tax_birth: Date,
  spo_ssn: String,
  spo_firstname: String,
  spo_lastname: String,
  spo_phone: String,
  spo_email: String,
  spo_birth: Date,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
})

export default mongoose.model('Profile', profileSchema)
