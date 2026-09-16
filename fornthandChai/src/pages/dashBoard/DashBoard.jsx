import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { getChannelVideos } from '../../api/authApi'
import { deleteVideo, togglePublishStatus } from "../../api/videoApi"
import VideoCard from "../../components/VideoCard"
import EditVideoModal from "../../components/EditVideoModal"
import PageLoader from "../../components/PageLoader"


function DashBoard() {
    //const navigate = useNavigate();
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editingVideo, setEditingVideo] = useState(null)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true)
                const data = await getChannelVideos()
                setVideos(data.data || [])
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load videos")
            } finally {
                setLoading(false)
            }
        }

        fetchVideos()
    }, [])

    const handleDelete = async (video) => {
        if (!window.confirm(`Delete "${video.title}"? This can't be undone.`)) return;
        try {
            await deleteVideo(video._id);
            setVideos((prev) => prev.filter((v) => v._id !== video._id));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete video");
        }
    };

    const handleTogglePublish = async (video) => {
        try {
            const data = await togglePublishStatus(video._id);
            setVideos((prev) => prev.map((v) => v._id === video._id ? { ...v, isPublished: data.data.isPublished } : v));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleUpdated = (updated) => {
        setVideos((prev) => prev.map((v) => v._id === updated._id ? { ...v, ...updated } : v));
    };

    if (loading) {
        return <PageLoader text="Loading your videos..." />
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg'>
                    {error}
                </div>
            </div>
        )
    }
    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-900'>Your Videos</h1>
                        <p className='text-gray-600 mt-2'>
                            {videos.length} {videos.length === 1 ? "video" : "videos"} uploaded
                        </p>
                    </div>
                    <Link
                        to="/upload"
                        className='px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors'
                    >
                        Upload video
                    </Link>
                </div>

                {videos.length === 0 ? (
                    <div className='bg-white rounded-xl shadow-sm p-16 text-center'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-3xl'>📹</span>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>No videos yet</h3>
                        <p className='text-gray-600 mb-6'>Upload your first video to get started</p>
                        <Link
                            to="/upload"
                            className='inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors'
                        >
                            Upload video
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {videos.map((video) => (
                            <VideoCard
                                key={video._id}
                                video={video}
                                showOwner={false}
                                showStatus={true}
                                onEdit={setEditingVideo}
                                onDelete={handleDelete}
                                onTogglePublish={handleTogglePublish}
                            />
                        ))}
                    </div>
                )}

                {editingVideo && (
                    <EditVideoModal
                        video={editingVideo}
                        onClose={() => setEditingVideo(null)}
                        onUpdated={handleUpdated}
                    />
                )}
            </div>
        </div>
    )
}

export default DashBoard