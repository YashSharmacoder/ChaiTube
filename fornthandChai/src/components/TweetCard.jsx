import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { updateTweet, deleteTweet } from "../api/tweetApi";
import Card from "./Card";
import Button from "./Button"
import LikeButton from "../components/LikeButton"

const MAX_LENGTH = 280;

function TweetCard( { tweet, onUpdated, onDeleted }) {
    const { user } = useAuth();
    const [ isEditing, setIsEditing ] = useState(false)
    const [ content, setContent ] = useState( tweet.content )
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState("")

    const isOwner = user?._id === tweet.owner || user?._id === tweet.owner?._id;
    const remaining = MAX_LENGTH - content.length 

    const handleSave = async () => {
        setError("")
        if (!content.trim()) {
            setError("Content is required")
            return
        }

        if (remaining < 0) {
            setError(`Tweet is ${Math.abs(remaining)} characters too long`);
            return;
        }

        try {
            setLoading(true)
            const data = await updateTweet(tweet._id, content.trim())
            onUpdated?.(data.data);
            setIsEditing(false) 
        } catch (err) {
            setError(err.res?.data?.message || "Failed to upload tweet")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
            setContent( tweet.content )
            setError("")
            setIsEditing(false)
        }

    const handleDelete = async () => {
            if (!window.confirm("Delete this tweet?")) return;
            setError("");
            try {
                setLoading(true);
                await deleteTweet(tweet._id);
                onDeleted?.(tweet._id);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete tweet");
                setLoading(false);
            }
        };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            { isEditing ? (
                <div>
                    <textarea
                        value={content}
                        onChange={ (e) => setContent(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full resize-none border border-gray-200 rounded-lg p-3 text-mist-900 outline-none focus:border-gray-400"
                    />

                    { error && (
                        <div className="mt-2">
                            <Card variant="message" tone="error">{ error }</Card>
                        </div>
                    )}

                    <div className="flex items-center justify-center mt-2">
                        <span className={`text-sm ${ remaining < 0 ? "text-red-600" : "text-gray-400" }`}>
                            { remaining }
                        </span>
                        <div className="flex gap-2">
                            <Button
                                onClick = { handleCancel }
                                disabled
                                className="px-4 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick = { handleSave }
                                disabled = {loading  || !content.trim() || remaining < 0 }
                                className="px-4 py-1.5 text-sm bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-40"
                            >
                                { loading ? "Saving..." : "Save" }
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-gray-900 whitespace-pre-wrap">{ tweet.content }</p>

                    { error && (
                        <div className="mt-2">
                            <Card variant="message" tone="error">{ error }</Card>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500">
                            { new Date(tweet.createdAt).toLocaleString() }
                        </p>

                        <div className="flex items-center gap-4">
                            <LikeButton
                                targetId={tweet._id}
                                type = "tweet"
                                initialLiked={ tweet.isLiked }
                                initialCount={tweet.likesCount}
                            />

                            { isOwner && (
                                <div className="flex gap-3">
                                    <Button 
                                        onClick = { () => setIsEditing(true) } 
                                        className="text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        onClick = { handleDelete } 
                                        disabled = { loading } 
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TweetCard
