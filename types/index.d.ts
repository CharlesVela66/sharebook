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
  $updatedAt?: number;
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
}

declare interface UserCardProps {
  $id: string;
  name: string;
  profilePic: string;
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

declare type Feed = {
  userId: string;
  userName?: string;
  userProfilePic?: string;
  books: Book[];
};

export type FormType = 'sign-in' | 'sign-up';

declare interface userProfilePictureProps {
  id: string;
  name: string;
  profilePic: string;
  username: string;
  email: string;
  dateOfBirth: string;
  country: string;
}
