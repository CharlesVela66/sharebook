import { Book, FormType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

export const authFormSchema = (formType: FormType) => {
  return z.object({
    name:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
    username:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
    country:
      formType === 'sign-up'
        ? z.string().min(2).max(100)
        : z.string().optional(),
    dateOfBirth:
      formType === 'sign-up'
        ? z.string().min(2).max(100)
        : z.string().optional(),
    email: z.string().email(),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformBookResponse = (response: any): Book[] => {
  if (!response?.success || !response?.books) {
    return [];
  }

  return response.books.map((book: Book) => ({
    id: book.id,
    title: book.title,
    authors: book.authors,
    description: book.description,
    pageCount: book.pageCount,
    publishedDate: book.publishedDate,
    categories: book.categories,
    thumbnail: book.thumbnail,
    averageRating: book.averageRating,
    ratingsCount: book.ratingsCount,
    userRating: book.userRating,
  }));
};
export const fixStatusTexts = (status: string) => {
  switch (status) {
    case 'WantToRead':
      return { activityText: 'wants to read', buttonText: 'Want To Read' };
    case 'CurrentlyReading':
      return {
        activityText: 'is currently reading',
        buttonText: 'Currently Re...',
      };
    case 'Read':
      return { activityText: 'has read', buttonText: 'Read' };
  }
};

export const transformStatusParams = (status: string) => {
  switch (status) {
    case 'read':
      return 'Read';
    case 'currently-reading':
      return 'CurrentlyReading';
    case 'want-to-read':
      return 'WantToRead';
  }
};
