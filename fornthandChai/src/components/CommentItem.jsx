import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateComment, deleteComment } from "../api/commentApi";

function CommentItem({ comment, onUpdated, onDeleted }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isOwner = user?._id === comment.owner?._id;

    const handleSave = async () => {
        if (!editText.trim()) {
            setError("Comment can't be empty");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await updateComment(comment._id, editText);
            onUpdated(data.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update comment");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteComment(comment._id);
            onDeleted(comment._id);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete comment");
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3 py-4">
            <img
                src={comment.owner?.avatar || "https://via.placeholder.com/36"}
                alt={comment.owner?.username}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                        @{comment.owner?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black resize-none"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(comment.content);
                                    setError("");
                                }}
                                className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                        {isOwner && (
                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-gray-500 hover:text-gray-900 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="text-xs text-gray-500 hover:text-red-600 font-medium disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        {error && !isEditing && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CommentItem;