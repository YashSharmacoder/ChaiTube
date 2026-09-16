import { useState, useEffect } from "react"
import { getWatchHistory, removeFromWatchHistory, clearWatchHistory } from "../../api/authApi"

function WatchHistory() {

    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [removingId, setRemovingId] = useState(null)
    const [clearing, setClearing] = useState(false)

    useEffect(() => {
        const fetchWatchHistory = async () => {
            try {
                setLoading(true)
                const data = await getWatchHistory();
                setVideos(data.data || [])
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load watch history")
            } finally {
                setLoading(false)
            }
        }
        fetchWatchHistory();
    }, [])

    const handleRemove = async (videoId) => {
        setRemovingId(videoId)
        try {
            await removeFromWatchHistory(videoId)
            setVideos((prev) => prev.filter((v) => v._id !== videoId))
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove video")
        } finally {
            setRemovingId(null)
        }
    }

    const handleClearAll = async () => {
        const confirmed = window.confirm("Clear your entire watch history? This can't be undone.")
        if (!confirmed) return

        setClearing(true)
        try {
            await clearWatchHistory()
            setVideos([])
        } catch (err) {
            setError(err.response?.data?.message || "Failed to clear watch history")
        } finally {
            setClearing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading watch history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Watch History</h1>

            {videos.length > 0 && (
                <button
                    onClick={handleClearAll}
                    disabled={clearing}
                    className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                    {clearing ? "Clearing..." : "Clear all"}
                </button>
            )}
        </div>

        {videos.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No videos in your watch history</p>
            </div>
        ) : (
            <div className="space-y-4">
                {videos.map((video) => (
                    <div
                        key={video._id}
                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-6 p-4"
                    >
                        {/* Video Thumbnail */}
                        <div className="flex-shrink-0">
                            <img
                                src={video.thumbnail || "https://via.placeholder.com/200x120"}
                                alt={video.title}
                                className="w-48 h-28 rounded-lg object-cover"
                            />
                        </div>

                        {/* Video Info */}
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {video.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={video.owner?.avatar || "https://via.placeholder.com/32"}
                                        alt={video.owner?.fullName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm text-gray-600">
                                        {video.owner?.fullName}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                {video.views?.toLocaleString() || 0} views {" "}
                                {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {video.description}
                            </p>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => handleRemove(video._id)}
                            disabled={removingId === video._id}
                            className="flex-shrink-0 text-red-600 hover:text-red-700 font-semibold disabled:opacity-40"
                        >
                            {removingId === video._id ? "..." : "✕"}
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default WatchHistory