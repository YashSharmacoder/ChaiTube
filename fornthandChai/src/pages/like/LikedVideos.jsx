import { useState,useEffect } from "react";
import { Link } from "react-router-dom"
import { getLikedVideos } from "../../api/likeApi"
import Card from "../../components/Card"

function LikedVideos() {
    const [ videos,setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                setLoading(true)
                const data = await getLikedVideos()
                setVideos(data.data || [])
            } catch (err) {
                setError(err.res?.data?.message || "Failed to  load Liked videos")
            }finally {
                setLoading(false)
            }
        }

        fetchLikedVideos()
    },[])


    if (loading) {
        return(
            <div className="min-h-screen flex items-center  justify-center">
                <p className="text-gray-600">Loading liked videos...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Liked videos</h1>
                    <p className="text-gray-600 mt-2">
                        { videos.length } { videos.length === 1 ? "video" : "videos" }  
                    </p>
                </div>

                { error && <Card variant="message" tone="error" className="mb-6"> { error } </Card> }

                { videos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl"> ❤️ </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No liked videos yet </h3>
                        <p className="text-gray-600">Videos you like will show up here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        { videos.map((item) => (
                            <Link
                                key={item._id}
                                to={`/video/${item.video?._id}`}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative w-full aspect-video bg-gray-200">
                                    { item.video?.thumbnail ? (
                                        <img
                                            src={ item.video.thumbnail }
                                            alt={ item.video.title }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No thumbnail
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex gap-3">
                                    <img
                                        src={ item.video?.owner?.avatar || "https://via.placeholder.com/36" }
                                        alt={ item.video?.owner?.username }
                                        className="w-9 h-9 rounded-full object-cover flex shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                                            { item.video?.title }
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            { item.video?.owner?.username }
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            { item.video?.views?.toLocaleString() || 0 } views
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LikedVideos