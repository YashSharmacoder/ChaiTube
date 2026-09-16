import { useAuth } from "../../context/AuthContext";
import { getUserPlaylists, deletePlaylist } from "../../api/playListApi";
import useFetch from "../../hooks/useFetch";
import Card from "../../components/Card";
import PageLoader from "../../components/PageLoader";
import CreatePlaylistModal from "../../components/CreatePlayListModel";
import Button from "../../components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

function PlayLists() {
    const { user } = useAuth();
    const { data: playlists, loading, error, setData: setPlaylists } = useFetch(
        () => getUserPlaylists(user._id),
        [user]
    );
    const [showCreate, setShowCreate] = useState(false);

    const handleDelete = async (e, playlistId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this playlist?")) return;
        try {
            await deletePlaylist(playlistId);
            setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete playlist");
        }
    };

    if (loading) return <PageLoader text="Loading playlists..." />;

    const list = playlists || [];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-heading text-gray-900">Your playlists</h1>
                        <p className="text-gray-600 mt-2">{list.length} {list.length === 1 ? "playlist" : "playlists"}</p>
                    </div>
                    <Button onClick={() => setShowCreate(true)} className="rounded-full">
                        + Create playlist
                    </Button>
                </div>

                {error && <Card variant="message" tone="error" className="mb-6">{error}</Card>}

                {list.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎵</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No playlists yet</h3>
                        <p className="text-gray-600 mb-6">Group your favorite videos into a playlist</p>
                        <Button onClick={() => setShowCreate(true)} className="rounded-full">
                            + Create playlist
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((playlist) => (
                            <Link
                                key={playlist._id}
                                to={`/playlist/${playlist._id}`}
                                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-5 block relative group"
                            >
                                <div className="w-full aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-[1.02]">
                                    🎵
                                </div>
                                <h3 className="font-semibold text-gray-900 line-clamp-1 font-heading">{playlist.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{playlist.description}</p>
                                <p className="text-xs text-gray-400 mt-2">{playlist.videos?.length || 0} videos</p>
                                <button
                                    onClick={(e) => handleDelete(e, playlist._id)}
                                    className="absolute top-3 right-3 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Delete
                                </button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {showCreate && (
                <CreatePlaylistModal
                    onClose={() => setShowCreate(false)}
                    onCreated={(p) => setPlaylists((prev) => [p, ...(prev || [])])}
                />
            )}
        </div>
    );
}

export default PlayLists;