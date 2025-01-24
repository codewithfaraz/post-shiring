import { POST_CATEGORIES, PostCategory } from "../types/post";

interface CategoryFilterProps {
  selectedCategory: PostCategory | "all";
  onSelectCategory: (category: PostCategory | "all") => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 pb-4">
        <button
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          All Posts
        </button>
        {POST_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
