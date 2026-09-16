import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVideos } from "../../api/videoApi";
import { useNavigate } from "react-router-dom";
import CategoryChips from "../../components/CategoryChips";

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)} yr ago`;
}

function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-xl bg-gray-200" />
      <div className="mt-3 flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-11/12" />
          <div className="h-3.5 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(`/video/${video._id}`)} className="text-left group focus:outline-none">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img
          src={video.thumbnail}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[12px] font-medium">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <img
          src={video.owner?.avatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-gray-900 font-medium text-[15px] leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-gray-600 text-[13px] mt-0.5 truncate flex items-center gap-1">
            {video.owner?.fullName}
            {video.owner?.isVerified && (
              <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </p>
          <p className="text-gray-500 text-[13px] mt-0.5">
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
      <h3 className="text-gray-900 text-lg font-semibold">No videos found</h3>
      <p className="text-gray-600 text-sm mt-1.5 max-w-xs">
        {query ? `No videos match "${query}".` : "No videos have been published yet."}
      </p>
      {query && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
        <span className="text-red-500 text-xl font-semibold">!</span>
      </div>
      <h3 className="text-gray-900 text-lg font-semibold">Something went wrong</h3>
      <p className="text-gray-600 text-sm mt-1.5 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

const SORTS = [
  { key: "createdAt:desc", label: "Newest", sortBy: "createdAt", sortType: "desc" },
  { key: "createdAt:asc", label: "Oldest", sortBy: "createdAt", sortType: "asc" },
  { key: "views:desc", label: "Most viewed", sortBy: "views", sortType: "desc" },
];

export default function VideoFeed() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [inputValue, setInputValue] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt:desc");
  const [retryTick, setRetryTick] = useState(0);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const limit = 8;
  const debounceRef = useRef(null);

  // Adjust state when the ?q= navbar search changes — done during render
  // (not in an effect) per React's "adjusting state when a prop changes" guidance.
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setInputValue(urlQuery);
    setQuery(urlQuery);
    setActiveCategory("All");
    setPage(1);
  }

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    if (cat === "All") {
      setInputValue("");
      setQuery("");
    } else {
      setInputValue(cat);
      setQuery(cat);
    }
  };

  const activeSort = SORTS.find((s) => s.key === sortKey) || SORTS[0];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setStatus("loading");
      setErrorMsg("");
      try {
        const res = await fetchVideos({
          page,
          limit,
          query,
          sortBy: activeSort.sortBy,
          sortType: activeSort.sortType,
        });
        if (!cancelled) {
          setVideos(res.data || []);
          setHasMore(res.hasMore);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err?.response?.data?.message || "Couldn't load videos. Check your connection and try again.");
          setStatus("error");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, sortKey, retryTick]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setQuery(inputValue.trim());
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-5">
        {/* Category chips */}
        <CategoryChips active={activeCategory} onSelect={handleCategorySelect} />

        {/* Search + sort bar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center flex-1 min-w-[240px] max-w-md border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 transition-colors">
            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setActiveCategory(null);
              }}
              placeholder="Search"
              className="w-full pl-5 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
            <div className="w-11 h-9 flex items-center justify-center border-l border-gray-300 bg-gray-50 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setSortKey(s.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  sortKey === s.key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {status === "ready" && (
            <span className="ml-auto text-gray-500 text-[13px]">page {page}</span>
          )}
        </div>

        {status === "error" ? (
          <ErrorState message={errorMsg} onRetry={() => setRetryTick((t) => t + 1)} />
        ) : status === "loading" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
            {Array.from({ length: limit }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <EmptyState
            query={query}
            onClear={() => {
              setInputValue("");
              setQuery("");
              setPage(1);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
              {videos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                ‹ Prev
              </button>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-black text-white">
                {page}
              </span>
              <button
                onClick={() => hasMore && setPage((p) => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                Next ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}