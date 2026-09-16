import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getVideoComments, addComment } from "../api/commentApi";
import CommentItem from "./CommentItem";
import InputField from "../components/InputField"
import Button from "../components/Button"
import { Link } from "react-router-dom";


function CommentSection({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const data = await getVideoComments(videoId, page);
                const result = data.data;
                setComments((prev) => (page === 1 ? result.docs : [...prev, ...result.docs]));
                setHasNextPage(result.hasNextPage);
                setTotalComments(result.totalDocs);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load comments");
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchComments();
    }, [videoId, page]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setError("Comment can't be empty");
            return;
        }
        try {
            setPosting(true);
            setError("");
            const data = await addComment(videoId, newComment);
            const withOwner = { ...data.data, owner: { username: user.username, avatar: user.avatar, _id: user._id } };
            setComments((prev) => [withOwner, ...prev]);
            setTotalComments((c) => c + 1);
            setNewComment("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post comment");
        } finally {
            setPosting(false);
        }
    };

    const handleUpdated = (updated) => {
        setComments((prev) => prev.map((c) => (c._id === updated._id ? { ...c, content: updated.content } : c)));
    };

    const handleDeleted = (deletedId) => {
        setComments((prev) => prev.filter((c) => c._id !== deletedId));
        setTotalComments((c) => c - 1);
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
            </h3>

            {user ? (
            <form onSubmit={handlePost} className="flex gap-3 mb-6">
                <img
                    src={user?.avatar || "https://via.placeholder.com/36"}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                    <InputField
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors"
                    />
                    {newComment && (
                        <div className="flex justify-end gap-2 mt-2">
                            <Button type="button" onClick={() => setNewComment("")} className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={posting} className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
                                {posting ? "Posting..." : "Comment"}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        ) : (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center justify-between">
                <span>Sign in to add a comment</span>
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in</Link>
            </div>
        )}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {loading && page === 1 ? (
                <p className="text-gray-500 text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onUpdated={handleUpdated}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}

            {hasNextPage && !loading && (
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Show more comments
                </button>
            )}
        </div>
    );
}

export default CommentSection;