import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Username is required'],
        unique: true,
        trim: true,
        minLength: [3,'Too Short'],
        maxLength:[20,'Too long'],
        match: [/^[a-zA-Z0-9_]+$/, 'Only letters, numbers & underscore'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 character long"],
        maxLength: [50, "Email must not be longer than 50 characters"]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role:{
        type: String,
        enum:['user','admin'],
        default:'user'
    }
},{timestamps:true})
    
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWT = function () {
    return jwt.sign({email: this.email, username:this.username,_id:this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const User = mongoose.model('user', userSchema)

export default User