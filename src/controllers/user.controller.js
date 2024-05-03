import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiErrors.js";
import { User } from "../models/User.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  // console.log("email:",email)
  // res.status(200).json({"message":`Hi ${email}`})

  if (!fullname || !email || !username || !password) {
    throw new apiError(400, "All fields are required");
  } else {
    const existedUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existedUser) {
      throw new apiError(409, "User already exists");
    }
  }

  console.log(req.body);
  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.coverImage[0]?.path;

  if (!avatarLocalpath) {
    throw new apiError(400, "Avatar image is compulsory");
  }
  const avatar = await uploadonCloudinary(avatarLocalpath);
  const coverImage = await uploadonCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new apiError(400, "Avatar image is compulsory");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiError(500, "Error by server side");
  }

  return res
    .status(200)
    .json(new apiResponse(200, createdUser, "User is Register!!"));
});

export default registerUser;
