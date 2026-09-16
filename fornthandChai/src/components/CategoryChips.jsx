const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "Live",
  "News",
  "Coding",
  "Comedy",
  "Movies",
  "Tech",
  "Travel",
  "Cooking",
  "Sports",
  "Fitness",
  "Podcasts",
];

export default function CategoryChips({ active, onSelect }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-3 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium flex-shrink-0 transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}