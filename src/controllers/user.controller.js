import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiErrors.js";
import { User } from "../models/User.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
  
    if (!fullname || !email || !username || !password) {
      throw new apiError(400, "All fields are required");
    }
  
    const existedUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
  
    if (existedUser) {
      throw new apiError(409, "User already exists");
    }
  
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    const coverImageLocalpath = req.files?.coverImage?.[0]?.path;
   console.log(avatarLocalpath)
    if (!avatarLocalpath) {
      throw new apiError(400, "Avatar image is compulsory");
    }
  
    const avatar = await uploadonCloudinary(avatarLocalpath);
    //console.log(avatar.url)
    if (!avatar || !avatar.url) {
      throw new apiError(400, "Failed to upload avatar image");
    }
  
    let coverImage = null;
    if (coverImageLocalpath) {
      coverImage = await uploadonCloudinary(coverImageLocalpath);
      if (!coverImage || !coverImage.url) {
        throw new apiError(400, "Failed to upload cover image");
      }
    }
  
    const newUser = new User({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage ? coverImage.url : "",
      username: username.toLowerCase(),
      email,
      password,
    });
  
    const user = await newUser.save();
  
    if (!user) {
      throw new apiError(500, "Error creating user");
    }
  
    return res.status(200).json(new apiResponse(200, user, "User is registered"));
  });
  
  export default registerUser;
  