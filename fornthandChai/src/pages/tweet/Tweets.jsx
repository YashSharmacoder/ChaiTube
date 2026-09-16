import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"
import { getUserTweets } from "../../api/tweetApi"
import CreateTweet from "../../components/CreateTweet"
import TweetCard from "../../components/TweetCard"
import Card from "../../components/Card";

function Tweets() {
    const { user } = useAuth()
    const [ tweets, setTweets ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")

    useEffect(() => {
        const fetchTweets = async () => {
            if (!user?._id) {
                return
            }

            try {
                setLoading(true)
                const data = await getUserTweets(user._id)
                setTweets(data.data || [])
            } catch (err) {
                setError(err.res?.data?.message || "Failed to load tweets")
            }finally {
                setLoading(false)
            }
        }

        fetchTweets()

    },[user])


    const handleTweetCreated = (newTweet) => {
        setTweets((prev) => [newTweet,...prev])
    }

    const handleTweetUpdated = (updatedTweet) => {
        setTweets((prev) =>
            prev.map((t) => (t._id === updatedTweet._id ? updatedTweet : t))
        )
    }

    const handleTweetDeleted = (tweetId) => {
        setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6"> Tweets </h1>

                <CreateTweet onTweetCreated={ handleTweetCreated } />

                <div className="mt-6 space-y-4">
                    { loading && <p className="text-gray-600 text-center">Loading tweets...</p> }

                    { error && <Card variant="mesaage" tone="error"> { error } </Card> }

                    { !loading && !error && tweets.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No tweets yet. </p>
                    )}


                    { tweets.map((tweet) =>(
                        <TweetCard
                            key={ tweet._id }
                            tweet={ tweet }
                            onUpdated={ handleTweetUpdated }
                            onDeleted={ handleTweetDeleted }
                        />
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Tweets