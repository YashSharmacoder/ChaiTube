import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function formatDuration(sec) {
    if (!sec && sec !== 0) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${String(s).padStart(2, "0")}`
}

function formatViews(n = 0) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`

    return String(n)
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days < 1) return "today"
    if (days === 1) return "1 day ago"
    if (days < 30) return `${days} days ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} mo ago`
    return `${Math.floor(months / 12)} yr ago`
}


function VideoCard({ video, showOwner = true, showStatus = false, onEdit, onDelete, onTogglePublish }) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const goToVideo = () => navigate(`/video/${video._id}`)

    return (
        <div className="text-left group relative w-full">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 cursor-pointer" onClick={goToVideo}>
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[12px] font-medium">
                    {formatDuration(video.duration)}
                </span>
                {showStatus && (
                    <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${video.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {video.isPublished ? "Public" : "Private"}
                    </span>
                )}
            </div>

            <div className="mt-3 flex gap-3">
                {showOwner && <img src={video.owner?.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />}
                <div className="min-w-0 flex-grow cursor-pointer" onClick={goToVideo}>
                    <h3 className="text-gray-900 font-medium text-[15px] leading-snug line-clamp-2">{video.title}</h3>
                    {showOwner && <p className="text-gray-600 text-[13px] mt-0.5 truncate">{video.owner?.fullName}</p>}
                    <p className="text-gray-500 text-[13px] mt-0.5">{formatViews(video.views)} views · {timeAgo(video.createdAt)}</p>
                </div>

                {showStatus && (
                    <div className="relative flex-shrink-0">
                        <Button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                        >
                            ⋮
                        </Button>
                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button onClick={() => { setMenuOpen(false); onEdit(video); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                    ✏️ Edit
                                </Button>
                                <Button onClick={() => { setMenuOpen(false); onTogglePublish(video); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                    {video.isPublished ? "🔒 Make Private" : "🌐 Make Public"}
                                </Button>
                                <Button onClick={() => { setMenuOpen(false); onDelete(video); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    🗑️ Delete
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoCard