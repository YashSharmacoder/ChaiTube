import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, updatePlaylist, getPlaylistById, removeVideoFromPlaylist, addVideoToPlaylist, deletePlaylist, getUserPlaylist } from "../controllers/playList.controller.js";


const router = Router()

router.use(verifyJWT)

// secure route

router.route("/").post(createPlaylist)
router.route("/user/:userId").get(getUserPlaylist);

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

export default router