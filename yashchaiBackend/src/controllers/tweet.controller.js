import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler( async (req, res) => {
    /*
        get content from req body
        validate content is not empty
        create tweet with content and owner (from req.user)
        validate tweet creation
        return created tweet
    */

    const { content } = req.body

    if (!content || content?.trim() === "") {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner : req.user?._id
    })

    if(!tweet) {
        throw new ApiError(500, "Failed to create tweet, please try again")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, tweet, "Tweet created successfully"
    ))
})

const getUserTweets = asyncHandler ( async ( req, res ) => {
    /*
        get userId from req params
        validate userId is a valid mongo id
        aggregate: match tweets by owner
        lookup owner details (username, fullName, avatar)
        add owner as first element (from array to object)
        sort by newest first
        return tweets
    */

    const { userId } = req.parms

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
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
        },
        {
            $sort : { createdAt : -1 }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse
        (200, tweets, "User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler ( async ( req, res ) => {
    /*
        get tweetId from req params
        get content from req body
        validate tweetId and content
        find tweet by id
        validate tweet exists
        check if logged in user is the owner
        update tweet content
        return updated tweet
    */
   const { tweetId } = req.params  // ✅ fixed
   const { content } = req.body

   if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id")
   }

   if ( !content || content?.trim() === "" ) {
    throw new ApiError(400, "Content is required")
   }

   const tweet = await Tweet.findById(tweetId)

   if (!tweet) {
    throw new ApiError(404, "Tweet not found")
   }


   if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "You are not authorized to update this tweet")
   }

   const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set : {
            content
        }
    },
    { new : true }
   )

   if (!updatedTweet) {
    throw new ApiError(500, "Failed to update tweet, please try again")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200, updatedTweet, "Tweet updated successfully")
   )
})

const deleteTweet = asyncHandler ( async ( req, res ) => {
    /*
        get tweetId from req params
        validate tweetId
        find tweet by id
        validate tweet exists
        check if logged in user is the owner
        delete the tweet
        return success response
    */

    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to delete this tweet")
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deleteTweet) {
        throw new ApiError(400, "Failed to delete the tweet, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Tweet deleted successfully")
    )
})

export { createTweet, getUserTweets , updateTweet, deleteTweet }