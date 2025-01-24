import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "@headlessui/react";
import Header from "./Header";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { PostCategory } from "../types/post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  setCurrentPost,
  setComments,
  addComment,
  setLoading,
} from "../store/postSlice";
import PostControllers from "../../controllers/postControllers";
import { toast } from "react-hot-toast";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PostDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState({
    byAuthor: [],
    byCategory: [],
  });
  const dispatch = useDispatch();
  const { currentPost, comments, isLoading } = useSelector(
    (state: RootState) =>
      state.post || { currentPost: null, comments: [], isLoading: true }
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const localUser = user || JSON.parse(localStorage.getItem("user") || "{}");

  // Add function to fetch related posts
  const fetchRelatedPosts = async (authorName: string, category: string) => {
    try {
      const [authorPosts, categoryPosts] = await Promise.all([
        PostControllers.fetchPostsByAuthor(authorName),
        PostControllers.fetchPostsByCategory(category),
      ]);

      if (authorPosts.status === 200 && categoryPosts.status === 200) {
        setRelatedPosts({
          byAuthor: authorPosts.data.filter((post: any) => post.post_id !== id),
          byCategory: categoryPosts.data.filter(
            (post: any) => post.post_id !== id
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;

      dispatch(setLoading(true));
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          PostControllers.fetchPostById(id), // Pass id directly as string
          PostControllers.fetchPostComments(id),
        ]);

        if (postResponse.status === 200) {
          dispatch(setCurrentPost(postResponse.data));
          // Fetch related posts after getting current post
          await fetchRelatedPosts(
            postResponse.data.author_name,
            postResponse.data.post_category
          );
        } else {
          toast.error(postResponse.message);
        }

        if (commentsResponse.status === 200) {
          dispatch(setComments(commentsResponse.data));
        }
      } catch (error) {
        toast.error("Failed to load post");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPostData();
  }, [id, dispatch]);

  const handleAddComment = async (commentContent: string) => {
    if (!commentContent.trim() || !currentPost) return;

    try {
      const response = await PostControllers.addComment({
        comment_content: commentContent,
        post_id: currentPost.post_id, // Changed from currentPost.id to currentPost.post_id
        user_id: localUser.id,
        comment_author_name: localUser.name, // Changed back to comment_author_name
      });

      if (response.status === 201) {
        dispatch(addComment(response.data));
        setComment(""); // Clear comment input after successful submission
        toast.success("Comment added successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      toast.error("Failed to add comment");
    }
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? <PostSkeleton /> : <div>Post not found</div>}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-xl">
              {currentPost.author_name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {currentPost.author_name}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>@{currentPost.author_username}</span>
                <span>·</span>
                <span>
                  {PostControllers.formatPostDate(currentPost.created_at)}
                </span>
              </div>
            </div>
            {/* Remove isFollowed check since we don't have that data yet */}
            <button className="ml-auto text-blue-600 hover:text-blue-700 font-medium text-sm">
              Follow
            </button>
          </div>

          {/* Post Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentPost.post_title}
          </h1>
          <div
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: currentPost.post_content }}
          />

          {/* Engagement */}
          <div className="flex items-center justify-between border-t border-b py-4 mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
              >
                <svg
                  className={`w-6 h-6 ${
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
                <span>{currentPost.likes || 0}</span>
              </button>
              <span className="text-gray-500">{comments.length} comments</span>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {currentPost.post_category}
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>

            {/* Comment Form */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-600">You</span>
              </div>
              <div className="flex-grow">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!comment.trim()}
                  onClick={() => handleAddComment(comment)}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {comment.comment_author_name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {comment.comment_author_name}
                      </span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-500">
                        {PostControllers.formatPostDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">
                      {comment.comment_content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </article>

        {/* Related Posts with Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tab.Group>
            <Tab.List className="flex space-x-4 border-b border-gray-200">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "py-4 px-1 text-sm font-medium focus:outline-none",
                    selected
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )
                }
              >
                More from {currentPost.author_name}
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "py-4 px-1 text-sm font-medium focus:outline-none",
                    selected
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )
                }
              >
                More in {currentPost.post_category}
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-6">
              <AnimatePresence mode="wait">
                {/* Author's Posts Tab */}
                <Tab.Panel
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {relatedPosts.byAuthor.length > 0 ? (
                    relatedPosts.byAuthor.map((post) => (
                      <PostCard
                        key={post.post_id}
                        {...post}
                        comments={post.comment_count} // Use comment_count here
                        preview
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-gray-500">
                        No other posts from this author yet.
                      </p>
                    </div>
                  )}
                </Tab.Panel>

                {/* Category Posts Tab */}
                <Tab.Panel
                  as={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {relatedPosts.byCategory.length > 0 ? (
                    relatedPosts.byCategory.map((post) => (
                      <PostCard
                        key={post.post_id}
                        {...post}
                        comments={post.comment_count} // Use comment_count here
                        preview
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-gray-500">
                        No other posts in this category yet.
                      </p>
                    </div>
                  )}
                </Tab.Panel>
              </AnimatePresence>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
}
