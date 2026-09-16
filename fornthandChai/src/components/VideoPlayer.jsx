import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { getVideoById } from "../api/videoApi"
import Button from "./Button"
import LikeButton from "./LikeButton"
import CommentSection from "./CommentSection"
import AddToPlayListModal from "./AddToPlayListModel"
import SubscribeButton from "./SubscribeButton"

function VideoPlayer() {
    const { videoId } = useParams()
    const [ showAddToPlaylist, setShowAddToPlaylist ] = useState(false)
    const [ video,setVideo ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true)
                const data = await getVideoById(videoId)
                setVideo(data.data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to  load video")
            } finally {
                setLoading(false)
            }
        }

        if (videoId) {
            fetchVideo()
        }
    },[videoId])

    if (loading) {
        return (
            <div className="w-full animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return <p className="text-red-500 font-medium">{ error }</p>
    }
    if(!video) return null

    return (
        <div className="flex flex-col gap-4">
            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md">
                <video
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    src={ video.videoFile }
                    poster={ video.thumbnail }
                />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 line-clamp-2">
                { video.title }
            </h1>

            {/* Channel Info & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4py-2 border-b border-gray-200 pb-4">
                {/* Owner Profile */}
                <div className="flex items-center gap-3">
                    <img
                        src={ video.owner.avatar }
                        alt={ video.owner.username }
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 leading-tight">
                            { video.owner.fullName }
                        </h3>
                        <p className="text-sm text-gray-500">
                            @{ video.owner.username }
                        </p>
                    </div>

                    {/* Using your custom Button component */}
                    <SubscribeButton
                        channelId={video.owner._id}
                        initialSubscribed={video.owner.isSubscribed}
                        initialCount={video.owner.subscribersCount}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Using your custom LikeButton component */}
                    <LikeButton
                        targetId={ video._id }
                        targetType="video"
                        initialCount={ video.likesCount || video.likes }
                        initialLiked={ video.isLiked }
                    />
                    <Button
                        onClick={ () => setShowAddToPlaylist(true) }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                    >
                        ➕ Save
                    </Button>
                </div>
            </div>

            {/* Description Box */}
            <div className="bg-gray-100 rounded-xl p-4 mt-2">
                <div className="flex gap-4 text-sm font-semibold text-gray-900 mb-2">
                    <span>{video.views?.toLocaleString()} views</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {video.description || "No description provided."}
                </p>
            </div>

            {/* Using your custom CommentSection component */}
            <CommentSection videoId={video._id} />

            { showAddToPlaylist && (
                <AddToPlayListModal
                    videoId={ video._id }
                    onClose={ () => setShowAddToPlaylist(false) }
                />
            )}
        </div>
    )
}


export default VideoPlayer