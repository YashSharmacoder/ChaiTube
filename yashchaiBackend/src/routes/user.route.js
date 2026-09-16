import { Router } from "express";
import { loginUser, logoutUser, refreshAccesssToken, registerUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory, removeFromWatchHistory, clearWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

console.log("USER ROUTE FILE LOADED"); // add this

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

//secure  routes 

router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccesssToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)


router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/history/:videoId").delete(verifyJWT, removeFromWatchHistory)
router.route("/history").delete(verifyJWT,clearWatchHistory)

export default router;