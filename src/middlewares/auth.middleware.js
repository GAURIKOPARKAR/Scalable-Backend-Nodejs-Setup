import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import apiError from "../utils/apiErrors.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }
    /*
    decodedToken contains following coming from User model
    _id:this._id,
        fullname:this.fullname,
        username:this.username,
        email:this.email,
    */
   /*this line of code verifies the authenticity of a JWT using a secret key and extracts the information contained within the JWT payload for further processing in the application. */
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  }
   catch (error) {
   throw new apiError(401, error?.message || "Invalid access token");
  }
});
