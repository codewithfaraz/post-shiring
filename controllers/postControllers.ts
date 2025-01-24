import supabase from "../utilities/supabase";

type CreatePostData = {
  post_title: string;
  post_category: string;
  post_content: string;
  author_id: string;
  author_name: string;
  author_username: string;
};

type ResponseType = {
  status: number;
  message: string;
  data?: any;
  error?: string;
};

class PostControllers {
  static async createPost(data: CreatePostData): Promise<ResponseType> {
    try {
      const { data: newPost, error } = await supabase
        .from("posts")
        .insert([
          {
            post_title: data.post_title,
            post_category: data.post_category,
            post_content: data.post_content,
            author_id: data.author_id,
            author_name: data.author_name,
            author_username: data.author_username,
            created_at: new Date().toISOString(), // Add creation date in ISO format
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Create post error details:", {
          error,
          errorMessage: error.message,
          details: error.details,
          hint: error.hint,
          requestData: data,
        });
        return {
          status: 400,
          message: "Failed to create post",
          error: error.message,
        };
      }

      return {
        status: 201,
        message: "Post created successfully",
        data: newPost,
      };
    } catch (error) {
      console.error("Unexpected error in createPost:", {
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        requestData: data,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  // Helper method to format dates for display
  static formatPostDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  static async getPostCommentCount(post_id: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post_id);

      if (error) {
        console.error("Get comment count error:", {
          error,
          post_id,
        });
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Unexpected error in getPostCommentCount:", {
        error,
        post_id,
      });
      return 0;
    }
  }

  static async fetchAllPosts(): Promise<ResponseType> {
    try {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Fetch posts error:", {
          error: postsError,
        });
        return {
          status: 400,
          message: "Failed to fetch posts",
          error: postsError.message,
        };
      }

      // Get comment counts for all posts
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await this.getPostCommentCount(post.post_id);
          return {
            ...post,
            comment_count: commentCount,
          };
        })
      );

      return {
        status: 200,
        message: "Posts fetched successfully",
        data: postsWithCounts,
      };
    } catch (error) {
      console.error("Unexpected error in fetchAllPosts:", {
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  static async fetchPostsByCategory(category: string): Promise<ResponseType> {
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("post_category", category)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch posts by category error:", { error, category });
        return {
          status: 400,
          message: "Failed to fetch posts",
          error: error.message,
        };
      }

      // Get comment counts for each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await this.getPostCommentCount(post.post_id);
          return {
            ...post,
            comment_count: commentCount,
          };
        })
      );

      return {
        status: 200,
        message: "Posts fetched successfully",
        data: postsWithCounts,
      };
    } catch (error) {
      console.error("Unexpected error in fetchPostsByCategory:", {
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        category,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  static async fetchPostById(post_id: string): Promise<ResponseType> {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("post_id", post_id)
        .single();

      if (error) {
        console.error("Fetch post by id error:", {
          error,
          post_id,
        });
        return {
          status: 400,
          message: "Failed to fetch post",
          error: error.message,
        };
      }

      return {
        status: 200,
        message: "Post fetched successfully",
        data: post,
      };
    } catch (error) {
      console.error("Unexpected error in fetchPostById:", {
        error,
        post_id,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  static async fetchPostComments(postId: number): Promise<ResponseType> {
    try {
      const { data: comments, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch comments error:", {
          error,
          postId,
        });
        return {
          status: 400,
          message: "Failed to fetch comments",
          error: error.message,
        };
      }

      return {
        status: 200,
        message: "Comments fetched successfully",
        data: comments,
      };
    } catch (error) {
      console.error("Unexpected error in fetchPostComments:", {
        error,
        postId,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  static async addComment(data: {
    comment_content: string;
    post_id: string; // Changed from number to string to match post_id type
    user_id: string;
    comment_author_name: string; // Changed back to comment_author_name
  }): Promise<ResponseType> {
    try {
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([
          {
            comment_content: data.comment_content,
            post_id: data.post_id,
            user_id: data.user_id,
            comment_author_name: data.comment_author_name, // Changed back to comment_author_name
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Add comment error:", {
          error,
          data,
          errorDetails: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        });
        return {
          status: 400,
          message: "Failed to add comment",
          error: error.message,
        };
      }

      return {
        status: 201,
        message: "Comment added successfully",
        data: newComment,
      };
    } catch (error) {
      console.error("Unexpected error in addComment:", {
        error,
        data,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }

  static async fetchPostsByAuthor(author_name: string): Promise<ResponseType> {
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_name", author_name)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch posts by author error:", {
          error,
          author_name,
        });
        return {
          status: 400,
          message: "Failed to fetch posts",
          error: error.message,
        };
      }

      // Get comment counts for each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await this.getPostCommentCount(post.post_id);
          return {
            ...post,
            comment_count: commentCount,
          };
        })
      );

      return {
        status: 200,
        message: "Posts fetched successfully",
        data: postsWithCounts,
      };
    } catch (error) {
      console.error("Unexpected error in fetchPostsByAuthor:", {
        error,
        author_name,
      });
      return {
        status: 500,
        message: "Internal server error",
        error: "Something went wrong",
      };
    }
  }
}

export default PostControllers;
