import { useState } from "react";
import { motion } from "framer-motion";
import { PostCategory } from "../types/post";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post_id: string | number; // Changed from id to post_id
  post_title: string; // Changed from title
  post_content: string; // Changed from content
  author_name: string; // Changed structure to match DB
  author_username: string; // Changed structure to match DB
  post_category: PostCategory; // Changed from category
  created_at: string; // Changed from createdAt
  likes: number;
  comments: number; // Simplify to just number type
  preview?: boolean;
}

export default function PostCard({
  post_id,
  post_title,
  post_content,
  author_name,
  author_username,
  post_category,
  created_at,
  likes,
  comments = 0, // Set default value
  preview = false,
}: PostCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const truncateContent = (text: string) => {
    // First remove HTML tags and decode HTML entities
    const div = document.createElement("div");
    div.innerHTML = text;
    const plainText = div.textContent || div.innerText || "";

    // Then truncate the clean text
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  return (
    <motion.article
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/post/${post_id}`)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
            {author_name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{author_name}</p>
            <p className="text-sm text-gray-500">@{author_username}</p>
          </div>
        </div>

        <div className="space-y-2 flex-grow">
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
            {post_title}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {post_category}
            </span>
            <span>·</span>
            <span>{created_at}</span>
          </div>
          <p className="text-gray-600 line-clamp-3 mt-2">
            {preview ? truncateContent(post_content) : post_content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <svg
                className={`w-5 h-5 ${
                  isLiked
                    ? "fill-blue-600 text-blue-600"
                    : "fill-none text-gray-500"
                }`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{comments}</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-blue-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
