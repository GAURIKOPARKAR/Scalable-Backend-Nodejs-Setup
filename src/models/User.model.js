import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
  {
    fullname: {
        type: String,
        required: true,
        trim: true,
      },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    coverImage: {
      type: String,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps:true}
);

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {this.password = await bcrypt.hash(this.password,10)}
    next()
})
userSchema.methods.isPasswordCorrect=(async function(password){
   return await bcrypt.compare(password,this.password)
})

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {_id:this._id,
        fullname:this.fullname,
        username:this.username,
        email:this.email,   
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {_id:this._id,
        fullname:this.fullname,
        username:this.username,
        email:this.email,   
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

//This User is kind of class extended by mongoose, and you will create its object further
export const User = mongoose.model("User", userSchema);
