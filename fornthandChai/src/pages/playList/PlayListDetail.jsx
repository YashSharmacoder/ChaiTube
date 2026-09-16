import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPlaylistById, removeVideoFromPlaylist, deletePlaylist } from "../../api/playListApi";
import Card from "../../components/Card";
import VideoCard from "../../components/VideoCard"
import Button from "../../components/Button";
import Slider from "../../components/Slider";

function PlaylistDetail() {
    const { playlistId } = useParams();
    const navigate = useNavigate()
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("slider"); // "slider" or "grid"
    const [removingVideo, setRemovingVideo] = useState(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                setLoading(true);
                const data = await getPlaylistById(playlistId);
                setPlaylist(data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove this video from the playlist?")) return;
        try {
            setRemovingVideo(videoId);
            await removeVideoFromPlaylist(playlistId, videoId);
            setPlaylist((prev) => ({
                ...prev,
                videos: prev.videos.filter((v) => v._id !== videoId),
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove video");
        } finally {
            setRemovingVideo(null);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Delete this entire playlist?")) return;
        try {
            await deletePlaylist(playlistId);
            navigate("/playlists")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete playlist");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading playlist...</p>
            </div>
        );
    }

    if (error && !playlist) {
        return (
            <div className="min-h-screen flex items-center justify-center max-w-md mx-auto">
                <Card variant="message" tone="error">{error}</Card>
            </div>
        );
    }

    if (!playlist) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{playlist.name}</h1>
                        <p className="text-gray-600 mt-2">{playlist.description}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {playlist.videos?.length || 0} videos • Slider View
                        </p>
                    </div>
                    <Button 
                        onClick={handleDeletePlaylist} 
                        bgColor="bg-transparent" 
                        textColor="text-red-600" 
                        className="border border-red-200 hover:bg-red-50"
                    >
                        Delete playlist
                    </Button>
                </div>

                {/* View Mode Toggle */}
                {playlist.videos && playlist.videos.length > 0 && (
                    <div className="flex gap-3 mb-8">
                        <button
                            onClick={() => setViewMode("slider")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                viewMode === "slider"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                            }`}
                        >
                            🎠 Slider View
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                viewMode === "grid"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                            }`}
                        >
                            ⊞ Grid View
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4">
                        <Card variant="message" tone="error">{error}</Card>
                    </div>
                )}

                {/* Empty State */}
                {!playlist.videos || playlist.videos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                        <p className="text-gray-600 text-lg">No videos in this playlist yet.</p>
                        <p className="text-gray-400 mt-2">Add videos to get started!</p>
                    </div>
                ) : viewMode === "slider" ? (
                    // Slider View
                    <div className="mb-12">
                        <Slider
                            items={playlist.videos}
                            itemsToShow={3}
                            renderItem={(video) => (
                                <div className="relative group h-full">
                                    <div className="h-full rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                                        <VideoCard
                                            video={video}
                                            showOwner={true}
                                            showStatus={false}
                                        />
                                    </div>
                                    {/* Remove Button - Appears on Hover */}
                                    <button
                                        onClick={() => handleRemoveVideo(video._id)}
                                        disabled={removingVideo === video._id}
                                        className={`absolute top-3 right-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-2 rounded-full transition-all duration-200 shadow-lg z-10 ${
                                            removingVideo === video._id ? "opacity-50" : ""
                                        }`}
                                    >
                                        {removingVideo === video._id ? "Removing..." : "Remove"}
                                    </button>
                                </div>
                            )}
                        />
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {playlist.videos.map((video) => (
                            <div key={video._id} className="relative group">
                                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <VideoCard
                                        video={video}
                                        showOwner={true}
                                        showStatus={false}
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemoveVideo(video._id)}
                                    disabled={removingVideo === video._id}
                                    className={`absolute top-2 right-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-2 py-1 rounded-full transition-all duration-200 shadow-lg ${
                                        removingVideo === video._id ? "opacity-50" : ""
                                    }`}
                                >
                                    {removingVideo === video._id ? "..." : "Remove"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <Link
                    to="/playlists"
                    className="inline-flex items-center gap-2 mt-8 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                    <span>←</span>
                    <span>Back to playlists</span>
                </Link>
            </div>
        </div>
    );
}

export default PlaylistDetail;