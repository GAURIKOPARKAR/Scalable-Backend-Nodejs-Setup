import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiErrors.js";
import { User } from "../models/User.model.js";
import {uploadonCloudinary , deleteFromCloudinary} from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    //we dont want to validate user again as User model will get start again and we have to pass password again
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating request and response token"
    );
  }
};

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
  console.log(req.files);
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);
  if (!(email || username)) {
    throw new apiError(400, "email or username is required");
  }
  //user is like an object of User model which can access methods of User model.
  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  console.log(user);
  if (!user) {
    throw new apiError(404, "this user does not exist");
  }
  const correctPassword = await user.isPasswordCorrect(password);
  console.log(correctPassword);
  if (!correctPassword) {
    throw new apiError(401, "Incorrect Credentials");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  /* A refresh token is a credential used to obtain a new access token after the original access token expires. 
    We store refresh token in database
  */

  const incomingrefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  try {
    const decodedToken = jwt.verify(
      incomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new apiError(401, "Invalid Refresh Token");
    }

    if (incomingrefreshToken !== user.refreshToken) {
      throw new apiError(401, "Invalid Refresh Token");
    }
    const { accessToken, refreshToken } = generateAccessandRefreshTokens(
      user?._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          "New access token generated"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Unauthorized access");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword && !newPassword) {
    throw new apiError(401, "Password is required");
  }
  //Will try this line of code ahead
  //const user = req.user

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apiError(401, "User does not exist");
  }

  const correctPassword = await user.isPasswordCorrect(oldPassword);

  if (!correctPassword) {
    throw new apiError(401, "Invalid Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new apiResponse(200, {}, "Password Updated successfully"));
});

const getCurrentUser = asyncHandler(async (req,res)=>{
  return res.status(200).json(new apiResponse(
    200,
    req.user,
    "Authenticated User"
  ))
})

const updateAccountDetails = asyncHandler(async (req, res)=>{
  const {fullname, email} = req.body
  if(!fullname || !email){
    throw new apiError(401,"fullname and email is required")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set :{fullname , email}
    },
    {
      new:true
    }).select("-password -refreshToken")

    if(!user){
      throw new apiError(401,"Invalid User")
    }

    return res.status(200).json(new apiResponse(200,user,"Data updated successfully"))
 
})

const updateUserAvatar = asyncHandler(async (req,res)=>{
  const user = await User.findById(req.user?._id)
  const imageURL = user.avatar
 // console.log(imageURL)
  const response = await deleteFromCloudinary(imageURL)
  //console.log(response)
  if(!response){
    throw new apiError(401,"Cant Delete")
  }


  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  //console.log(req.files);
  if (!avatarLocalpath) {
    throw new apiError(400, "Avatar image is compulsory");
  }

  const avatar = await uploadonCloudinary(avatarLocalpath);
  //console.log(avatar.url)
  if (!avatar || !avatar.url) {
    throw new apiError(400, "Failed to upload avatar image");
  }
  
  user.avatar = avatar
  await user.save({validateBeforeSave:false})

  res.status(200).json(new apiResponse(200,"avatar updated successfully"))

})

const getUserChannelDetails = asyncHandler(async (req, res)=>{

})

export { registerUser, loginUser, logOutUser, refreshAccessToken,changePassword, getCurrentUser,updateAccountDetails, updateUserAvatar, getUserChannelDetails };
