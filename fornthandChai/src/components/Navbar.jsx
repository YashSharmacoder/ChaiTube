import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    navigate(trimmed ? `/videos?q=${encodeURIComponent(trimmed)}` : "/videos");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full flex items-center justify-between gap-4 px-3 sm:px-4">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMenuClick}
            aria-label="Toggle menu"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">▶</span>
            </div>
            <span className="text-lg font-bold hidden sm:inline">YashChai</span>
          </Link>
        </div>

        {/* Center: search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center">
          <div className="flex items-center flex-1 border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 transition-colors">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="w-full pl-5 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-11 h-9 flex items-center justify-center border border-l-0 border-gray-300 bg-gray-50 rounded-r-full hover:bg-gray-100 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Mobile search icon */}
        <button
          onClick={() => navigate("/videos")}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Right: upload / avatar / auth */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {user ? (
            <>
              <Link
                to="/upload"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="Upload"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0-12 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
                <span className="text-sm font-medium hidden lg:inline">Upload</span>
              </Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center"
              >
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
                    </div>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Your profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Your videos
                    </Link>
                    <Link to="/playlists" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      🎵 Playlists
                    </Link>
                    <Link to="/change-password" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap hidden sm:inline-block"
              >
                Create
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;