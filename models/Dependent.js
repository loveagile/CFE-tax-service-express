import mongoose from 'mongoose'

const dependentSchema = new mongoose.Schema({
  profile_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  firstname: String,
  lastname: String,
  ssn: String,
  birth: Date,
})

export default mongoose.model('Dependent', dependentSchema)
