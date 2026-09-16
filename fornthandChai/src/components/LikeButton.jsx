import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike } from "../api/likeApi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button"

const toggleFns = {
    video: toggleVideoLike,
    comment: toggleCommentLike,
    tweet: toggleTweetLike,
}

function LikeButton({ targetId, targetType, initialLiked, initialCount, size = "md" }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(initialLiked || false)
    const [count, setCount] = useState(initialCount || 0)
    const [loading, setLoading] = useState(false)

    const toggleFn = toggleFns[targetType]

    const handleClick = async () => {
        if (!user) {
            navigate("/login")
            return
        }

        const previousLiked = isLiked
        const previousCount = count

        setIsLiked(!isLiked)
        setCount(isLiked ? count - 1 : count + 1)

        try {
            setLoading(true)
            const data = await toggleFn(targetId)
            const liked = data.data.isLiked ?? data.data.isliked
            setIsLiked(liked)
        } catch (err) {
            setIsLiked(previousLiked)
            setCount(previousCount)
            console.log(err);
            
        } finally {
            setLoading(false)
        }
    }

    const iconSize = size === "sm" ? "text-base" : "text-xl"

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                isLiked ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
            <span className={iconSize}>{isLiked ? "❤️" : "🤍"}</span>
            <span className="text-sm font-medium">{count.toLocaleString()}</span>
        </Button>
    )
}

export default LikeButton