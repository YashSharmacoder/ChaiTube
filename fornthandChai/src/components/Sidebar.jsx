import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Icon({ path, className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const ICONS = {
  home: "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  shorts: "M14 4v6l5-3-5-3ZM6 4h5v16H8a2 2 0 0 1-2-2V4Z",
  subs: "M4 6h16M4 12h16M4 18h7",
  history: "M12 8v4l3 2M21 12a9 9 0 1 1-3-6.7M21 4v5h-5",
  liked: "M14 9V5a2 2 0 0 0-2-2l-3 7v11h9.3a2 2 0 0 0 2-1.6l1.3-6.7A2 2 0 0 0 19.6 10H14ZM7 21H4V10h3",
  playlists: "M4 6h11M4 12h11M4 18h6M17 10l5 3-5 3v-6Z",
  yourVideos: "M15 10 20 6.5v11L15 14M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
  stats: "M4 20V10M10 20V4M16 20v-7M4 20h16",
  profile: "M4 20c0-4 3.6-6 8-6s8 2 8 6M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  tweet: "M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.7 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.6a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.4-1.3 2-2.1Z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 12a7.5 7.5 0 0 1 .1-1.2L3 9.3l1.5-2.6 2 .6a7.6 7.6 0 0 1 2-1.2L9 4h3l.5 2.1c.7.3 1.4.7 2 1.2l2-.6L18 9.3l-1.6 1.5a7.5 7.5 0 0 1 0 2.4L18 14.7l-1.5 2.6-2-.6a7.6 7.6 0 0 1-2 1.2L12 20H9l-.5-2.1a7.6 7.6 0 0 1-2-1.2l-2 .6L3 14.7l1.6-1.5c-.07-.4-.1-.8-.1-1.2Z",
};

function SidebarLink({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-5 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
          isActive ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-800 hover:bg-gray-100"
        }`
      }
    >
      <Icon path={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div className="py-2 border-b border-gray-200 last:border-b-0">
      {title && <h3 className="px-3 pt-1 pb-2 text-[15px] font-semibold text-gray-900">{title}</h3>}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-60 bg-white overflow-y-auto z-30 transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:z-20`}
      >
        <SidebarSection>
          <SidebarLink to="/" end icon={ICONS.home} label="Home" />
          <SidebarLink to="/videos" icon={ICONS.shorts} label="Shorts" />
          {user && <SidebarLink to="/subscriptions" icon={ICONS.subs} label="Subscriptions" />}
        </SidebarSection>

        {user && (
          <SidebarSection title="You">
            <SidebarLink to="/watch-history" icon={ICONS.history} label="History" />
            <SidebarLink to="/liked-videos" icon={ICONS.liked} label="Liked videos" />
            <SidebarLink to="/dashboard/videos" icon={ICONS.yourVideos} label="Your videos" />
            <SidebarLink to="/playlists" icon={ICONS.playlists} label="Playlists" />
            <SidebarLink to="/dashboard/stats" icon={ICONS.stats} label="Channel stats" />
            <SidebarLink to="/subscribers" icon={ICONS.profile} label="Subscribers" />
            <SidebarLink to="/tweets" icon={ICONS.tweet} label="Tweets" />
          </SidebarSection>
        )}

        {user && (
          <SidebarSection title="Settings">
            <SidebarLink to="/profile" icon={ICONS.profile} label="Your profile" />
            <SidebarLink to="/change-password" icon={ICONS.settings} label="Change password" />
          </SidebarSection>
        )}

        {!user && (
          <SidebarSection>
            <p className="px-3 text-[13px] text-gray-600 leading-relaxed">
              Sign in to like videos, comment, and subscribe to channels.
            </p>
            <SidebarLink to="/login" icon={ICONS.profile} label="Sign in" />
          </SidebarSection>
        )}
      </aside>
    </>
  );
}