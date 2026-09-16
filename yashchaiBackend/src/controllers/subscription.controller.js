import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { Video } from '../models/video.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from  "../utils/asyncHandler.js"


const toggleSubscription =  asyncHandler( async ( req,res ) => {
    /*
        get channelId from req params
        validate channelId
        check if channel exists
        check if logged in user has already subscribed to this channel
        if subscribed, remove the subscription (unsubscribe)
        if not subscribed, create a new subscription (subscribe)
        return response indicating subscribed/unsubscribed status
    */
    
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // Prevent users from subscribing to their own channel if needed
    if (channelId.toString() === req.user?._id?.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
    }

    const newSubscription = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (!newSubscription) {
        throw new ApiError(500, "Failed to subscribe, please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"));
});
// controller to return subscriber list of a channel


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    /*
        get channelId from req params
        validate channelId
        check if channel exists
        find all subscriptions where channel matches channelId
        lookup subscriber details for each subscription
        return list of subscribers
    */
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "subscriber",
                foreignField : "_id",
                as : "subscriber",
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
                subscriber : {
                    $first : "$subscriber"
                }
            }
        },
        {
            $project : {
                subscriber : 1,
                createdAt : 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
}) 

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    /*
        get subscriberId from req params
        validate subscriberId
        check if user exists
        find all subscriptions where subscriber matches subscriberId
        lookup channel details for each subscription
        return list of subscribed channels
    */
    
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscriber = await User.findById(subscriberId)

    if (!subscriber) {
        throw new ApiError(404, "User not found")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match : {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "channel",
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
                channel : {
                    $first : "$channel"
                }
            }
        },
        {
            $project : {
                channel : 1,
                createdAt : 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"))
})


export  { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }