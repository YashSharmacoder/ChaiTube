import VideoPlayer from "../../components/VideoPlayer";
import RecommendedVideos from "../../components/RecomendedVideos";

function VideoWatchPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6">

                {/* Left Side: Main Video Content & Comments */}
                <div className="flex-grow min-w-0 flex flex-col gap-6">
                    <VideoPlayer />
                </div>

                {/* Right Side: Recommended Videos */}
                <aside className="flex shrink-0 lg:w-[400] xl:w-[420]">
                    <RecommendedVideos />
                </aside>
            </div>
        </div>
    )
}

export default VideoWatchPage