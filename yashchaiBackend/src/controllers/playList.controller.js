import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from '../models/playlist.model.js'
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createPlaylist =  asyncHandler ( async ( req, res ) => {
    /*
        get name and description from req body
        validate both fields are not empty
        create playlist with name, description and owner (from req.user)
        validate playlist creation
        return created playlist
    */

    const { name, description } = req.body
    console.log("Received body:", req.body)

    /*if (
        [ name, description ].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "All field is required")
    }*/

    if (!name || name?.trim() === "" ) {
        throw new ApiError(400, "Name field is required")
    }

    if (!description || description?.trim() === "" ) {
        throw new ApiError(400, "description field is required")
    }

    const createdPlaylist = await Playlist.create({
        name,
        description,
        owner : req.user?._id
    })

    if (!createdPlaylist) {
        throw new ApiError(500, "Failed to create playlist, please try again")
    }

    return res
    .status(201)
    .json(
        new ApiResponse (201, createdPlaylist, "PlayLIst Created SuccessFully")
    )
})

const getUserPlaylist = asyncHandler( async ( req, res ) => {
    /*
        get userId from req params
        validate userId is a valid mongo id
        find all playlists where owner matches userId
        return playlists
    */
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const playLists = await Playlist.find({ owner : userId })

    return res
    .status(200)
    .json((new ApiResponse(200, playLists, "User playlists fetched successfully")))
})

const getPlaylistById = asyncHandler ( async( req,res ) => {
    /*
        get playlistId from req params
        validate playlistId
        find playlist by id
        validate playlist exists
        return playlist
    */
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId).populate({
        path: "videos",
        select: "title description thumbnail duration views isPublished createdAt owner",
        populate: { path: "owner", select: "username fullName avatar" }
    })

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler ( async ( req,res ) => {
    /*
        get playlistId and videoId from req params
        validate both ids
        find playlist by id, validate it exists
        find video by id, validate it exists
        check if logged in user is the playlist owner
        add video to playlist (avoid duplicates)
        return updated playlist
    */
    const { playlistId,videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to modify this playlist")
    }

    const updatedPlaylist =  await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet : {
                videos : videoId
            }
        },
        { new : true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to add video to playlist, please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler( async ( req,res ) => {
    /*
        get playlistId and videoId from req params
        validate both ids
        find playlist by id, validate it exists
        find video by id, validate it exists
        check if logged in user is the playlist owner
        remove video from playlist
        return updated playlist
    */

    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to modify this playlist")
    }


    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                videos : videoId
            }
        },
        { new : true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to remove video from playlist, please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    /*
        get playlistId from req params
        validate playlistId
        find playlist by id
        validate playlist exists
        check if logged in user is the owner
        delete the playlist
        return success response
    */
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to delete this playlist")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedPlaylist) {
        throw new ApiError(400, "Failed to delete the playlist, please try again")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async ( req,res ) => {
    /*
        get playlistId from req params
        get name and description from req body
        validate playlistId, name and description
        find playlist by id
        validate playlist exists
        check if logged in user is the owner
        update playlist name and description
        return updated playlist
    */
    
    const { playlistId } = req.params
    const { name, description } = req.body
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to update this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                name,
                description
            }
        },
        { new : true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Failed to update playlist, please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})


export { createPlaylist, getUserPlaylist, getPlaylistById, addVideoToPlaylist, deletePlaylist, removeVideoFromPlaylist, updatePlaylist }