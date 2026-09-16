import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSubscribedChannels } from "../../api/subscriptionApi";
import Card from "../../components/Card";
import PageLoader from "../../components/PageLoader"


function Subscriptions() {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setLoading(true);
                const data = await getSubscribedChannels(user._id);
                setChannels(data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load subscriptions");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchChannels();
    }, [user]);

    if (loading) {
        return <PageLoader text="Loading subscriptions..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Subscriptions</h1>
                    <p className="text-gray-600 mt-2">Channels you follow ({channels.length})</p>
                </div>

                {error && <Card variant="message" tone="error" className="mb-6">{error}</Card>}

                {channels.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📺</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Not following anyone yet</h3>
                        <p className="text-gray-600">Subscribe to channels to see them here</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm divide-y">
                        {channels.map((sub) => (
                            <Link
                                key={sub._id}
                                to={`/c/${sub.channel?.username}`}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <img
                                    src={sub.channel?.avatar || "https://via.placeholder.com/48"}
                                    alt={sub.channel?.fullName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{sub.channel?.fullName}</p>
                                    <p className="text-sm text-gray-600">@{sub.channel?.username}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Since {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscriptions;