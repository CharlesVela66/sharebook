declare interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  pageCount: number;
  publishedDate: string;
  categories: string[];
  thumbnail: string;
  averageRating: number;
  ratingsCount: number;
  userRating?: number;
  status?: string;
}

declare interface User {
  $id: string;
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

export type FormType = 'sign-in' | 'sign-up';
