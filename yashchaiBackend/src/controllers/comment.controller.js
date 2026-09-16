import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from '../models/video.model.js'

const getVideoComments = asyncHandler(async (req, res) => {
    /*
        get videoId from req params
        get page and limit from req query (with defaults)
        validate videoId
        find video by id, validate it exists
        aggregate: match comments by video
        lookup owner details for each comment
        add owner as first element (from array to object)
        project only required fields
        sort by newest first
        paginate the aggregation result
        return paginated comments
    */
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const commentsAggregate  = Comment.aggregate([
        {
            $match : {
                video :new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner"
            }
        },
        {
            $addFields : {
                owner : {
                    $first : "$owner"
                }
            }
        },
        {
            $project : {
                content : 1,
                owner : {
                    username : 1,
                    fullName : 1,
                    avatar : 1
                },
                createdAt : 1
            }
        },
        {
            $sort : {
                createdAt : -1
            }
        }
    ])

    const options = {
        page: parseInt(page , 10),
        limit : parseInt(limit , 10)
    }

    const comments = await Comment.aggregatePaginate(commentsAggregate , options)

    return res 
    .status(200)
    .json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )

})

const addComment = asyncHandler ( async ( req, res ) => {
    /*
        get videoId from req params
        get content from req body
        validate videoId and content
        find video by id, validate it exists
        create comment with content, video and owner (from req.user)
        validate comment creation
        return created comment
    */
    const { videoId } = req.params
    const { content } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : req.user?._id
    })

    if (!comment) {
        throw new ApiError(500, "Failed to add comment, please try again")
    }

    return  res
    .status(201)
    .json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    /*
        get commentId from req params
        get content from req body
        validate commentId and content
        find comment by id
        validate comment exists
        check if logged in user is the owner
        update comment content
        return updated comment
    */
    const { commentId } = req.params
    const { content } = req.body

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    if (!content || content?.trim() === "") {
        throw new ApiError(400, "Contennt is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to update this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set : {
                content
            }
        },
        { new : true }
    )

    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    /*
        get commentId from req params
        validate commentId
        find comment by id
        validate comment exists
        check if logged in user is the owner
        delete the comment
        return success response
    */
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to delete this comment")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deletedComment) {
        throw new ApiError(400, "Failed to delete the comment, please try again")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment deleted successfully")
        )
})




export { getVideoComments, addComment, updateComment, deleteComment }