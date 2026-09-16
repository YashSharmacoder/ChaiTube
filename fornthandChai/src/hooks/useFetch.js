import { useState, useEffect } from "react";

function useFetch( fetchFn, deps = [] ) {
    
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState("")

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                setLoading(true)
                setError("")
                const res = await fetchFn()
                if(!cancelled) setData(res.data)
            } catch (err) {
                if(!cancelled) setError(err.response?.data?.message || "Something went wrong")
            } finally {
                if(!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { data, loading, error, setData }
}

export default useFetch