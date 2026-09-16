import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Share Your Videos with the World
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload, share, and connect with millions of viewers on YashChai. Start your journey today.
              </p>
              {user ? (
                <Link
                  to="/upload"
                  className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                >
                  Upload Your First Video
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
            <div className="hidden md:block">
              <div className="w-full h-80 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 15.472c-1.879 1.879-4.906 1.879-6.785 0l-5.454-5.454c-1.879-1.879-1.879-4.906 0-6.785s4.906-1.879 6.785 0L12 4.343l-.839-.839c-.941-.941-2.453-.941-3.394 0-1.879 1.879-1.879 4.906 0 6.785l5.454 5.454c1.879 1.879 4.906 1.879 6.785 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose YashChai?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Upload</h3>
              <p className="text-gray-600">Upload your videos in just a few clicks. Support for all major formats and high-quality streaming.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Audience</h3>
              <p className="text-gray-600">Reach millions of viewers worldwide. Build your community and grow your channel.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Tools</h3>
              <p className="text-gray-600">Analytics, custom thumbnails, playlists, and more to manage your channel professionally.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-red-600">10M+</p>
              <p className="text-gray-600 mt-2">Videos Uploaded</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">50M+</p>
              <p className="text-gray-600 mt-2">Daily Views</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">1M+</p>
              <p className="text-gray-600 mt-2">Active Creators</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">195</p>
              <p className="text-gray-600 mt-2">Countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-xl text-red-100 mb-8">Join thousands of creators sharing their passion every day.</p>
          {user ? (
            <Link
              to="/upload"
              className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Upload Now
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-red-700 text-white font-semibold rounded-full hover:bg-red-800 transition-colors border border-white"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">YashChai</h3>
              <p className="text-sm">The platform for creators to share and connect.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm text-center">© 2026 YashChai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;