import { useState } from "react";
import { toggleSubscription } from "../api/subscriptionApi";
import Button from "./Button";

function SubscribeButton({ channelId, initialSubscribed, initialCount, onChannge }) {
    const [ isSubscribed, setIsSubscribed ] = useState( initialSubscribed || false )
    const [ count, setCount ] = useState( initialCount || 0 )
    const [ loading, setLoading ] = useState(false)

    const handleClick = async () => {
        const previousState = isSubscribed
        const previousCount = count

        //optimistic update
        setIsSubscribed(!isSubscribed)
        setCount(isSubscribed ? count - 1 : count + 1)

        try {
            setLoading(true)
            const data = await toggleSubscription( channelId )
            setIsSubscribed(data.data.subscribed)
            onChannge?.(data.data.subscribed)
        } catch (err) {
            console.log(err);
            setIsSubscribed(previousState)
            setCount(previousCount)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick = { handleClick }
                disabled = { loading }
                className={`px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50 ${ 
                    isSubscribed
                        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
                { isSubscribed ? "Subscribed" : "Subscribe" }
            </Button>
            <span className="text-sm text-gray-600">{ count.toLocaleString() }</span>
        </div>
    )
}

export default SubscribeButton