import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Post = {
  id: number;
  text: string;
  image: string | null;
};

type PostsState = {
  posts: Post[];
};

const initialState: PostsState = {
  posts: [
    {
      id: 1,
      text: "Le nouveau dirigeant syrien Ahmad al-Chareh a déclaré dimanche que toutes les armes du pays seront placées sous le contrôle de l'État syrien.",
      image: null,
    },
    {
      id: 2,
      text: 'France : Bayrou opère les "derniers réglages" de la composition de son gouvernement',
      image: null,
    },
  ],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<{ text: string; image: string | null }>) => {
      const newPost: Post = {
        id: state.posts.length + 1,
        text: action.payload.text,
        image: action.payload.image,
      };
      state.posts.unshift(newPost);
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    updatePost: (
      state,
      action: PayloadAction<{ id: number; text: string; image: string | null }>
    ) => {
      const { id, text, image } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === id);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], text, image };
      }
    },
  },
});

export const { addPost, deletePost, updatePost } = postsSlice.actions;

export default postsSlice.reducer;
