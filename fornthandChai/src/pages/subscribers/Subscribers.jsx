import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserChannelSubscribers } from "../../api/subscriptionApi";
import Card from "../../components/Card";
import PageLoader from "../../components/PageLoader";

function Subscribers() {
    const { user } = useAuth();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);
                const data = await getUserChannelSubscribers(user?._id);
                setSubscribers(data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load subscribers");
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchSubscribers();
        }
    }, [user]);

    if (loading) {
        return <PageLoader text="Loading subscribers..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Subscribers</h1>
                    <p className="text-gray-600 mt-2">
                        {subscribers.length} {subscribers.length === 1 ? "person follows" : "people follow"} your channel
                    </p>
                </div>

                {error && <Card variant="message" tone="error" className="mb-6">{error}</Card>}

                {subscribers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">👥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscribers yet</h3>
                        <p className="text-gray-600">Keep uploading - your audience will grow</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm divide-y">
                        {subscribers.map((sub) => (
                            <div key={sub._id} className="flex items-center gap-4 p-4">
                                <img
                                    src={sub.subscriber?.avatar || "https://via.placeholder.com/48"}
                                    alt={sub.subscriber?.fullName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{sub.subscriber?.fullName}</p>
                                    <p className="text-sm text-gray-600">@{sub.subscriber?.username}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscribers;