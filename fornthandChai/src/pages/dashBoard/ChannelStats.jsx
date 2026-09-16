import { useAuth } from "../../context/AuthContext";
import { getChannelStats } from "../../api/authApi";
import Card from "../../components/Card";
import PageLoader from "../../components/PageLoader"
import useFetch from "../../hooks/useFetch"

function ChannelStats() {
    const { user } = useAuth();
    
    const { data : stats, loading, error } = useFetch(getChannelStats, [user] )

    if (loading) {
        return <PageLoader text="Loading channel stats..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center max-w-md mx-auto">
                <Card variant="message" tone="error">{error}</Card>
            </div>
        );
    }

    const avgViewsPerVideo =
        stats?.totalVideos > 0
            ? Math.round(stats.totalViews / stats.totalVideos).toLocaleString()
            : 0;

    const likeRate =
        stats?.totalViews > 0
            ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(2)
            : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Channel Analytics</h1>
                    <p className="text-gray-600 mt-2">View your channel performance and statistics</p>
                </div>

                {/* Stats Grid - same Card component, 4 times */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Card icon="📹" iconBg="bg-blue-100" label="Total Videos"
                        value={stats?.totalVideos || 0} subtext="Videos uploaded" />
                    <Card icon="👁️" iconBg="bg-green-100" label="Total Views"
                        value={stats?.totalViews?.toLocaleString() || 0} subtext="All time views" />
                    <Card icon="👥" iconBg="bg-red-100" label="Subscribers"
                        value={stats?.totalSubscribers?.toLocaleString() || 0} subtext="Channel subscribers" />
                    <Card icon="❤️" iconBg="bg-pink-100" label="Total Likes"
                        value={stats?.totalLikes?.toLocaleString() || 0} subtext="Video likes" />
                </div>

                {/* Section wrapper - same Card component, different variant */}
                <Card title="Performance Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Health</h3>
                            <div className="space-y-4">
                                <Card variant="row" label="Avg Views per Video" value={avgViewsPerVideo} />
                                <Card variant="row" label="Like Rate" value={`${likeRate}%`} />
                                <Card variant="row" label="Engagement Score" value="Good" valueColor="text-green-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <Card variant="row" label="Videos Published" value={stats?.totalVideos || 0}
                                    valueColor="text-blue-600" highlightColor="bg-blue-50" borderColor="border-blue-600" />
                                <Card variant="row" label="Total Reach" value={stats?.totalViews?.toLocaleString() || 0}
                                    valueColor="text-green-600" highlightColor="bg-green-50" borderColor="border-green-600" />
                                <Card variant="row" label="Community Size" value={stats?.totalSubscribers?.toLocaleString() || 0}
                                    valueColor="text-red-600" highlightColor="bg-red-50" borderColor="border-red-600" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tip banner - same Card component, message variant */}
                <div className="mt-8">
                    <Card variant="message" tone="info">
                        <span className="font-semibold">💡 Tip:</span> Keep uploading quality content to
                        increase your views and subscribers. Engage with your audience through likes and
                        comments to boost your channel's performance.
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ChannelStats;