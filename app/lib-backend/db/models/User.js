import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. DEFINE THE SCHEMA (blueprint)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'], // Error message if missing
    trim: true, 
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, 
    lowercase: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email' 
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6, 
    select: false 
  },
  avatar: {
    type: String,
    default: null 
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], 
    default: 'customer' 
  }
}, {
  timestamps: true 
});


userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();
  
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;