import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  id: number;
  comment_content: string;
  post_id: number;
  user_id: string;
  comment_author_name: string;
  created_at: string;
}

interface Post {
  post_id: string; // Changed from number to string
  post_title: string;
  post_content: string;
  post_category: string;
  author_id: string;
  author_name: string;
  author_username: string;
  created_at: string;
  comments?: Comment[];
}

interface PostState {
  currentPost: Post | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostState = {
  currentPost: null,
  comments: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      state.currentPost = action.payload;
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentPost, setComments, addComment, setLoading, setError } =
  postSlice.actions;
export default postSlice.reducer;
