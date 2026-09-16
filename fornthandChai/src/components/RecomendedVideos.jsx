import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchVideos } from '../api/videoApi'; // Adjust path to where fetchVideos is exported

function RecommendedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                // Utilizing your existing fetchVideos function (fetching a small limit for the sidebar)
                const response = await fetchVideos({ page: 1, limit: 10, sortBy: 'views', sortType: 'desc' });
                setVideos(response.data);
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-2 animate-pulse">
                        <div className="w-40 aspect-video bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 py-1">
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 font-bold text-lg mb-2 hidden lg:block">Up Next</h3>
            
            {videos.map((video) => (
                <Link 
                    to={`/video/${video._id}`} 
                    key={video._id}
                    className="flex flex-col sm:flex-row lg:flex-row gap-3 group"
                >
                    <div className="relative w-full sm:w-40 lg:w-40 flex-shrink-0">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-gray-900 text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {video.title}
                        </h4>
                        <div className="text-gray-500 text-xs mt-1">
                            <span>{video.owner?.fullName || video.owner?.username}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span>{video.views?.toLocaleString()} views</span>
                                <span>•</span>
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default RecommendedVideos;