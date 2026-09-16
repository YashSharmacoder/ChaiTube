import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js" 
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import mongoose , { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadONCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"



const getAllVideos = asyncHandler ( async ( req, res ) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    /*
        get query parmas : page , limits, sortBy, query, sortType, userId
        build match stage - filter by title/ description if query given ,by owner if userId given 
        build sort stage - sortBy field , sortType acs/desc, default createAt desc
        run aggregation with pagination (skip/limit)
        return paginated result
    */

    if (userId && !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const video = await Video.aggregate([
    {
        $match : {
                 ...( query && {
            $or: [
                {title: { $regex : query ,  $options : "i" }},
                {description : { $regex : query , $options : "i" }}
            ]
          }),
          ...(userId && {
            owner : new mongoose.Types.ObjectId(userId)
          }),
          isPublished : true
        }
    },
    {
        $lookup : {
            from: "users",
            localField: "owner",
            foreignField : "_id",
            as : "video-Owner",
            pipeline: [
                {
                    $project : {
                        fullName : 1,
                        username : 1,
                        avatar : 1
                    }
                }
            ]
        }
    },
    {
        $addFields : {
            owner : {
                $first : "$video-Owner"
            }
        }
    },
    {
        $sort : sortBy && sortType ? { [sortBy] : sortType === "asc" ? 1 : -1} : { createdAt : -1}
    },
    {
        $skip :  ( parseInt(page, 10) - 1 ) * parseInt(limit, 10 )
    },
    {

        $limit : parseInt (limit, 10)
    },
    {
        $project : {
            title : 1,
            description : 1,
            thumbnail : 1,
            videoFile : 1,
            duration : 1,
            views : 1,
            isPublished : 1,
            createdAt : 1,
            owner : 1

        }
    }
])
console.log("Match stage would find:", await Video.countDocuments({ isPublished: true }))
console.log("Aggregation returned:", video.length, "documents")
    
return res
.status(200)
.json(
    new ApiResponse ( 200, video, "Videos Feteched successfully")
)
})


const publishAVideo = asyncHandler ( async (req, res ) => {
    const { title, description } =  req.body

    if (
        [ title , description ].some((field) => field?.trim() == "" )
    ) {
        throw new ApiError(400, "All field is required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath  = req.files?.thumbnail[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Videofile and thumbnail file is requried")
    }

    const videoFile = await uploadONCloudinary(videoLocalPath)
    const thumbnail = await uploadONCloudinary(thumbnailLocalPath)

    const video = await Video.create({
        title,
        thumbnail: thumbnail.secure_url,
        videoFile : videoFile.secure_url,
        description,
        duration : videoFile.duration,
        isPublished : true,
        owner : req.user?._id
    })

    const uploadedVideo = await Video.findById(video._id)

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while publishing the video")
    }

    return res
    .status(201)
    .json(new ApiResponse (201, uploadedVideo, "Video published successfully"))
})

const getVideoById = asyncHandler ( async (req, res) => {
    const { videoId } = req.params

    console.log("Logged In User ID: ", req.user?._id);

    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video  = await Video.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(videoId)
            },
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline : [
                    {
                        $lookup : {
                            from : "subscriptions",
                            localField : "_id",
                            foreignField : "channel",
                            as : "subscribers"
                        }
                    },
                    {
                        $addFields : {
                            subscribersCount : {
                                $size : "$subscribers"
                            },
                            isSubscribed : {
                                $cond : {
                                    if : { $in : [req.user?._id ?? null, "$subscribers.subscriber"]},
                                    then : true,
                                    else : false
                                }
                            }
                        }
                    },
                    {
                        $project : {
                            fullName : 1,
                            username : 1,
                            avatar : 1,
                            subscribersCount : 1,
                            isSubscribed : 1
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
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    const isOwner = req.user && video[0].owner._id.toString() === req.user._id.toString()

    if (!video[0].isPublished && !isOwner) {
        throw new ApiError(404, "Video not found")
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc : { views : 1 }
    })

    if (req.user) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet : { watchHistory : new mongoose.Types.ObjectId(videoId) }
        })
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200, video[0],"Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to update this video")
    }

    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    if (thumbnailLocalPath) {
        const thumbnail = await uploadONCloudinary(thumbnailLocalPath)

        if (!thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail")
        }

        await deleteFromCloudinary(video.thumbnail,"image")
        updateFields.thumbnail = thumbnail.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        { new: true }
    ).select("-videoFile -views -owner")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    console.log("Searching for:", videoId)
    //console.log("Found:", video)
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400 ,"Invalid video id")
    }

    const video = await Video.findById(videoId)


    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to delete this video")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if (!deletedVideo) {
        throw new ApiError(400, "Failed to delete the video, please try again")
    }

    await deleteFromCloudinary(video.videoFile, "video") // extract public_id if needed
    await deleteFromCloudinary(video.thumbnail, "image")

    // optional cleanup: remove from every user's watchHistory and likes
    await User.updateMany(
        { watchHistory: new mongoose.Types.ObjectId(videoId) },
        { $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) } }
    )

    await Like.deleteMany({ video: videoId })
    await Comment.deleteMany({ video: videoId })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to change publish status")
    }

    const toggledVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set : {
                isPublished : !video.isPublished
            }
        },
        { new : true }
    )

    if (!toggledVideo) {
        throw new ApiError(500, "Failed to toggle video publish status")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isPublished: toggledVideo.isPublished },
                "Video publish status toggled successfully"
            )
        )
})


export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus }