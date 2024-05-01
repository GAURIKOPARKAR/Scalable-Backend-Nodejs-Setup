import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req,res)=>{

    const {fullName,email,username,password} = req.body
    console.log("email:",email)
    res.status(200).json({"message":`Hi ${email}`})
})

export default registerUser