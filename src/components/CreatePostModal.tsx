import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { motion, AnimatePresence } from "framer-motion";
import { POST_CATEGORIES, PostCategory } from "../types/post";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toast } from "react-hot-toast";
import PostControllers from "../../controllers/postControllers";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory>(POST_CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const localUser = user || JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        post_title: title,
        post_category: category,
        post_content: content,
        author_id: localUser.id,
        author_name: localUser.name,
        author_username: localUser.username,
      };

      const response = await PostControllers.createPost(postData);

      if (response.status === 201) {
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-4xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Post</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent bg-white"
              >
                {POST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <Editor
                apiKey="81h240pmyr4om10u7z0y52b5qfdz5sd2v53cbbprwqs69yjo" // Replace with your actual API key
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | image | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  placeholder: "Write your post content here...",
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
