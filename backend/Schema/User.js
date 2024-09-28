
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [/^\S+@\S+$/, 'Invalid email']
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
      }
})

const User = mongoose.model('User', userSchema);
module.exports = User