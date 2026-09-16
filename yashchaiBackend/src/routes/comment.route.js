import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoComments, addComment, updateComment, deleteComment } from '../controllers/comment.controller.js'

const router = Router()

// public — comments koi bhi dekh sakta hai, login zaroori nahi
router.route("/:videoId").get(getVideoComments)

// yahan se neeche login zaroori
router.use(verifyJWT)

router.route("/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router