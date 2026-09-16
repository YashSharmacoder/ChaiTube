import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { getUserPlaylists, addVideoToPlaylist } from "../api/playListApi"
import CreatePlayListModal from "../components/CreatePlayListModel"
import Button from "../components/Button";

function AddToPlayListModal({ videoId, onClose }) {
    const { user } = useAuth()
    const [ playlists, setPlaylists ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")
    const [ addedIds, setAddedIds ] = useState([])
    const [ showCreate, setShowCreate ] = useState(false)
    const [ successMsg, setSuccessMsg ] = useState("")
    
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const data = await getUserPlaylists(user._id);
                setPlaylists(data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load playlists");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchPlaylists();
    }, [user]);

    const handleAdd = async (playlistId, playlistName) => {
        try {
            await addVideoToPlaylist(playlistId, videoId);
            setAddedIds((prev) => [...prev, playlistId]);
            setSuccessMsg(`Added to "${playlistName}" ✓`);
            setTimeout(() => setSuccessMsg(""), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add video");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Save to playlist</h2>
                    <button onClick={onClose} className="text-2xl leading-none hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                </div>
                {successMsg && (
                    <p className="text-green-600 text-sm font-medium mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        {successMsg}
                    </p>
                )}
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading playlists...</p>
                ) : playlists.length === 0 ? (
                    <p className="text-gray-500 text-sm mb-4">You don't have any playlists yet.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                        {playlists.map((playlist) => {
                            const isAdded = addedIds.includes(playlist._id) || playlist.videos?.includes(videoId);
                            return (
                                <label key={playlist._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={isAdded} disabled={isAdded} onChange={() => handleAdd(playlist._id, playlist.name)} className="w-4 h-4" />
                                    <span className="text-sm text-gray-900">{playlist.name}</span>
                                    {isAdded && <span className="text-green-600 text-xs font-medium ml-auto">Added ✓</span>}
                                </label>
                            );
                        })}
                    </div>
                )}

                <Button
                    onClick={ () => setShowCreate(true)}
                    className="w-full text-left text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
                >
                    + Create new Playlist
                </Button>
            </div>
            {showCreate && <CreatePlayListModal onClose={() => setShowCreate(false)} onCreated={(p) => setPlaylists((prev) => [p, ...prev])} />}
        </div>
    )
}

export default AddToPlayListModal