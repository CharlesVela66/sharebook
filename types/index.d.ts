declare interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  rating: number;
  numberRatings: number;
  pageCount: number;
  publishedDate: string;
  categories: string[];
  coverImage: string;
}

declare interface User {
  id: number;
  name: string;
  email: string;
  profilePic: string;
  username: string;
  dateOfBirth: string;
  country: string;
  createdAt: string;
  readingGoal?: number | null;
  friends?: User[] | null;
}
