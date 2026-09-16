import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createTweet } from '../api/tweetApi'
import Card from './Card'
import Button from "./Button"

const MAX_LENGTH = 280;

function CreateTweet({ onTweetCreated }) {
  const { user } = useAuth()
  const [ content, setContent ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] =  useState("")
  
  
  const remaining = MAX_LENGTH - content.length;
  const isOverLimit = remaining < 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!content.trim()) {
      setError("Content is required")
      return
    }

    if (isOverLimit) {
      setError(`Tweet is ${Math.abs(remaining)} characters too long`)
      return
    }

    try {
      setLoading(true)
      const data = await  createTweet(content.trim())
      setContent("")
      onTweetCreated?.(data.data)
    } catch (err) {
      setError(err.res?.data?.message || "Failed to  create tweet, please try again")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='bg-white rounded-xl shadow-sm  p-6'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-3'>
          <img 
            src={ user?.avatar || "https://via.placeholder.com/48" }
            alt={ user?.username }
            className='w-12 h-12 rounded-full object-cover flex-shrink-0'
          />

          <div className='flex-1'>
            <textarea 
              value={ content }
              onChange={ (e) => setContent(e.target.value) }
              placeholder='What is happening'
              rows={3}
              className='w-full resize-none border-none focus:ring-0
              text-lg placeholder-gray-400 outline-none'
            />

            { error && (
              <div className='mt-2'>
                <Card variant='message' tone="error">{ error }</Card>
              </div>
            )}

            <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
              <span 
                className={`text-sm ${
                  isOverLimit
                    ? "text-red-600 font-medium"
                    : remaining <= 20
                    ? "text-yellow-600"
                    : "text-gray-400"
                }`}
              >
                { remaining }
              </span>

              <Button 
                type='submit'
                disabled= { loading || !content.trim() || isOverLimit } 
                className='px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
              >
                { loading ? "Posting..." : "Post" }
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateTweet
