import { useState } from "react";
import { updateVideo } from "../api/videoApi";
import InputField from "./InputField";
import Button from "./Button";

function EditVideoModal({ video, onClose, onUpdated }) {
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError("Title and description are required");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await updateVideo(video._id, { title, description, thumbnail });
            onUpdated(data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit video</h2>
                    <button onClick={onClose} className="text-2xl leading-none hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black resize-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">New thumbnail (optional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="text-sm" />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-2 justify-end pt-2">
                        <Button type="button" onClick={onClose} bgColor="bg-transparent" textColor="text-gray-600" className="hover:bg-gray-100">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-full">
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditVideoModal;