import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js";


const toggleVideoLike = asyncHandler( async( req, res ) => {
    /*
        get videoId from req params
        validate videoId
        check if video exists
        check if logged in user has already liked this video
        if liked, remove the like (unlike)
        if not liked, create a new like
        return response indicating liked/unliked status
    */
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Video not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : req.user?._id
    })
    
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)


        return res
        .status(200)
        .json(new ApiResponse(200,{ isliked : false }, "Video unliked successfully"))
    }

    const newLike = await Like.create({
        video : videoId,
        likedBy : req.user?._id
    })

    if (!newLike) {
        throw new ApiError(500, "Failed to like video, please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { isliked : true }, "Video liked  successfully"))
})

const toggleCommentLike = asyncHandler( async ( req,res ) => {
    /*
        get commentId from req params
        validate commentId
        check if comment exists
        check if logged in user has already liked this comment
        if liked, remove the like (unlike)
        if not liked, create a new like
        return response indicating liked/unliked status
    */
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)


    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        
        return  res
        .status(200)
        .json(new ApiResponse(200, { isliked : false }, "Coomment unliked successfully"))
    }

    const newLike = await Like.create({
        comment : commentId,
        likedBy : req.user?._id
    })

    if (!newLike) {
        throw new ApiError(500, "Failed to like comment, please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, { isliked : true } , "Comment liked sujccessfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    /*
        get tweetId from req params
        validate tweetId
        check if tweet exists
        check if logged in user has already liked this tweet
        if liked, remove the like (unlike)
        if not liked, create a new like
        return response indicating liked/unliked status
    */
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"))
    }

    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (!newLike) {
        throw new ApiError(500, "Failed to like tweet, please try again")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"))
})

const getLikedVideos = asyncHandler( async( req,res ) => {
    /*
        find all likes by logged in user where video field exists
        lookup video details for each like
        lookup owner details for each video
        add owner as first element (from array to object)
        project only required fields
        return list of liked videos
    */
    const likedVideos =  await Like.aggregate([
        {
            $match : {
                likedBy : new mongoose.Types.ObjectId(req.user?._id),
                video : { $exists : true }
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        username : 1,
                                        fullName : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields : {
                            owner : {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                video : {
                    $first : "$video"
                }
            }
        },
        {
            $project : {
                video : 1,
                createdAt : 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos,"Liked Videos feched successfully"))

})

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos }