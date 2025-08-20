import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        // enum: ["regular_user", "admin", "moderator"], // restricts to these values
        default: "regular_user",                      // if not given, defaults to user
        required: true
    }
}, {timestamps: true})



// for pwd encryption
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// for checking pwd
// we are writing custom method to check our pwd -  it returns boolean
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id, // we'll get this from mongodB
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id, // we'll get this from mongodB
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);