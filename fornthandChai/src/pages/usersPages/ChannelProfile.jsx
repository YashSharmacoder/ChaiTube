import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserChannelProfile } from "../../api/authApi"
import Button from "../../components/Button"


export default function ChannelProfile() {

    const { username } = useParams();
    const [channel, setChannel ] = useState(null)
    const [ loading,setLoading ] = useState(true)
    const [ error, setError ] = useState("")
    const [ isSubscribed, setIsSubscribed ] = useState(false)

    useEffect( () => {
        const fetchChannel = async () => {
            try {
                setLoading(true)
                const data = await getUserChannelProfile(username)
                setChannel(data.data)
                setIsSubscribed(data.data.isSubscribed)
            } catch (err) {
                setError(err.res?.data?.message || "Failed to load channel");
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchChannel();
        }
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading channel...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        )
    }

    if (!channel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Channel not found</p>
            </div>
        );
    }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        {channel.coverImage ? (
            <img 
                src={channel.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400"/>
        )}
      </div>

      {/* Channel Info */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-end gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={channel.avatar || "https://via.placeholder.com/150"}
                        alt={channel.fullName}
                        className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                </div>

                {/* Channel Details */}
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-900">{channel.fullName}</h1>
                    <p className="text-gray-600 mt-1">@{channel.username}</p>
                    <p className="text-gray-600 mt-1">{channel.email}</p>

                    {/* Stats */}
                    <div className="flex gap-8 mt-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {channel.subscribersCount?.toLocaleString() || 0}
                            </p>
                            <p className="text-sm text-gray-600">Subscribers</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {channel.channelsSubscribedToCount || 0}
                            </p>
                            <p className="text-sm text-gray-600">Following</p>
                        </div>
                    </div>
                </div>

                {/* Subscribe Button */}
                <div>
                    <Button
                        onClick={() => setIsSubscribed(!isSubscribed)}
                        className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                            isSubscribed
                                ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                </div>
            </div>
        </div>
      </div>
      {/* Placeholder for Videos Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-full h-40 bg-gray-300" />
                            <div className="p-4">
                                <p className="font-semibold text-gray-900">Video Title</p>
                                <p className="text-sm text-gray-600 mt-1">Channel Name</p>
                                <p className="text-sm text-gray-600">1.2M views • 2 months ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

