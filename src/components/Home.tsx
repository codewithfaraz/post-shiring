import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { PostCategory } from "../types/post";
import { toast } from "react-hot-toast";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import FeedToggle from "./FeedToggle";
import PostCard from "./PostCard";
import PostControllers from "../../controllers/postControllers";
import { motion } from "framer-motion";

// Create a skeleton loader component for posts grid
const PostsGridSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="animate-pulse">
        <div className="h-[300px] bg-gray-200 rounded-lg"></div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const localUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "all"
  >("all");
  const [currentFeed, setCurrentFeed] = useState<"all" | "following">("all");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response =
        selectedCategory === "all"
          ? await PostControllers.fetchAllPosts()
          : await PostControllers.fetchPostsByCategory(selectedCategory);

      if (response.status === 200) {
        setPosts(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  // Function to safely render HTML content
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {localUser?.name}!
          </h1>
          <FeedToggle currentFeed={currentFeed} onToggle={setCurrentFeed} />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {isLoading ? (
          <PostsGridSkeleton />
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {posts.map((post: any) => (
              <PostCard
                key={post.post_id}
                post_id={post.post_id}
                post_title={post.post_title}
                post_content={post.post_content}
                author_name={post.author_name}
                author_username={post.author_username}
                post_category={post.post_category}
                created_at={post.created_at}
                likes={post.likes || 0}
                comments={post.comment_count}
                preview
              />
            ))}
          </motion.div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {currentFeed === "following"
                ? "No posts from authors you follow in this category."
                : "No posts found in this category."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
