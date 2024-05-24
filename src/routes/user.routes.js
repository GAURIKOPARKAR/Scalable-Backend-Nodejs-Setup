import { Router } from "express";
import {logOutUser, loginUser, registerUser,refreshAccessToken,changePassword,getCurrentUser,updateAccountDetails, updateUserAvatar} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    }
   ]),
  registerUser
);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT , logOutUser)
router.route("/refresh-access").post(refreshAccessToken)
router.route("/changepassword").post(verifyJWT,changePassword)
router.route("/getcurrentuser").post(verifyJWT,getCurrentUser)
router.route("/updateaccountdetails").post(verifyJWT,updateAccountDetails)
router.route("/updateuseravatar").post(  upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }  
 ]),verifyJWT,updateUserAvatar)


export default router;
