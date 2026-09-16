import { useState } from "react"
import LoginPage from "./pages/usersPages/LoginPage"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { Route, Routes } from "react-router-dom"
import Register from "./pages/usersPages/Register"
import UploadVideo from './pages/videos.conntroller.pages/UploadVideoPage'
import Profile from "./pages/usersPages/Profile"
//import Home from "./pages/Home"
import {ProtectedRoute} from "./components/ProtectedRoute"
import ChannelProfile from "./pages/usersPages/ChannelProfile"
import WatchHistory from "./pages/usersPages/WatchHistory"
import ChangePassword from "./pages/usersPages/ChangePassword"
import LikedVideos from "./pages/like/LikedVideos"
import PlaylistDetail from "./pages/playList/PlayListDetail"
import Subscribers from "./pages/subscribers/Subscribers"
import Subscriptions from "./pages/subscribers/Subscriptions"
import Tweets from "./pages/tweet/Tweets"
import ChannelStats from "./pages/dashBoard/ChannelStats"
import DashBoard from "./pages/dashBoard/DashBoard"
import VideoFeed from "./pages/videos.conntroller.pages/VideoFeed"
import VideoWatchPage from "../src/pages/videos.conntroller.pages/VideoWatchPage"
import PlayLists from "./pages/playList/PlayLists"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return(
    <>
    <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    <main className="pt-16 lg:pl-60 min-h-screen bg-white">
    <Routes>
      <Route path="/" element={<VideoFeed/>} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/videos" element={<VideoFeed/>}/>
      <Route path="/c/:username" element={<ChannelProfile/>}/>
      <Route path="/video/:videoId" element={<VideoWatchPage/>}/>
      
      <Route 
        path="/playlists" 
        element={
          <ProtectedRoute>
              <PlayLists/>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <UploadVideo/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute>
            <ChangePassword/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/watch-history" 
        element={
          <ProtectedRoute>
            <WatchHistory/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/liked-videos" 
        element={
          <ProtectedRoute>
            <LikedVideos/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/playlist/:playlistId" 
        element={
          <ProtectedRoute>
            <PlaylistDetail/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/subscribers" 
        element={
          <ProtectedRoute>
            <Subscribers/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/subscriptions" 
        element={
          <ProtectedRoute>
            <Subscriptions/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/tweets" 
        element={
          <ProtectedRoute>
            <Tweets/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard/stats" 
        element={
          <ProtectedRoute>
            <ChannelStats/>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard/videos" 
        element={
          <ProtectedRoute>
            <DashBoard/>
          </ProtectedRoute>
        }
      />
    </Routes>
    </main>
    </>
  )
}

export default App