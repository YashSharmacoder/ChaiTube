import { useState } from "react";
import { createPlaylist } from "../api/playListApi";
import InputField from "./InputField";
import Button from "./Button";

function CreatePlaylistModal({ onClose, onCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            setError("Name and description are required");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await createPlaylist(name, description);
            onCreated(data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create playlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold font-heading">Create playlist</h2>
                    <button onClick={onClose} className="text-2xl leading-none hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Name" placeholder="e.g. Watch later" value={name} onChange={(e) => setName(e.target.value)} />
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="What's this playlist about?"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand resize-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex gap-2 justify-end pt-2">
                        <Button type="button" onClick={onClose} bgColor="bg-transparent" textColor="text-gray-600" className="hover:bg-gray-100">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-full">
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePlaylistModal;