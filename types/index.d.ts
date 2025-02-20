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

declare type BookResponse = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    publishedDate?: string;
    categories?: string[];
    imageLinks: {
      thumbnail: string;
    };
    averageRating: number;
    ratingsCount?: number;
  };
};
