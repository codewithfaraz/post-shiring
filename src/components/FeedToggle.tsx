interface FeedToggleProps {
  currentFeed: "all" | "following";
  onToggle: (feed: "all" | "following") => void;
}

export default function FeedToggle({ currentFeed, onToggle }: FeedToggleProps) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-4">
      <button
        onClick={() => onToggle("all")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${
            currentFeed === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
      >
        For You
      </button>
      <button
        onClick={() => onToggle("following")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${
            currentFeed === "following"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Following
      </button>
    </div>
  );
}
