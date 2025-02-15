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
  email: string;
  username: string;
  dateOfBirth: string;
  country: string;
  createdAt: string;
  readingGoal?: number;
  friends?: User[];
}
