import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', 'admin'],
    default: 'freelancer'
  },
  // Common fields
  profileImage: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
  bio: {
    type: String,
    trim: true
  },
  // For freelancers
  hourlyRate: {
    type: Number,
    default: 0
  },
  // For clients
  companyName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model('User', userSchema);
