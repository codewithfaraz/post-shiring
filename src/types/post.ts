export const POST_CATEGORIES = [
  "Technology",
  "Health",
  "Beauty",
  "Lifestyle",
  "Food",
  "Travel",
  "Business",
  "Education",
  "Sports",
  "Entertainment",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
