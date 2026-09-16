import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    /*
        get channel id from req.user (logged in user is the channel owner)
        count total videos uploaded by this channel
        sum total views across all videos
        count total subscribers for this channel
        count total likes across all videos owned by this channel
        return combined stats object
    */
    const channelId = req.user?._id
    
    const totalVideos = await Video.countDocuments({ owner : channelId })

    const totalViewsResult = await Video.aggregate([
        {
            $match :
            {
                owner : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group : {
                _id : null,
                totalViews : { $sum : "$views"}
            }
        }
    ])

    const totalViews = totalViewsResult[0]?.totalViews || 0

    const totalSubscribers = await Subscription.countDocuments({ channel : channelId })

    const totalLikesResult = await Like.aggregate([
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video"
            }
        },
        {
            $match : {
                "video.owner" : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $count : "totalLikes"
        }
    ])

    const totalLikes = totalLikesResult[0]?.totalLikes || 0

    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    }

    return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel Stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    /*
        get channel id from req.user (logged in user is the channel owner)
        find all videos where owner matches channel id
        sort by newest first
        return list of channel videos
    */
    const channelId = req.user?._id

    const videos = await Video.find({ owner : channelId }).sort({ createdAt : -1 })


    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }