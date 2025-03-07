import { Book, BookResponse, FormType } from '@/types';
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

export const transformBookResponse = (book: BookResponse): Book => {
  return {
    id: book.id,
    title: book.volumeInfo?.title || 'Untitled',
    authors: book.volumeInfo?.authors || [],
    description: cleanBookDescription(book.volumeInfo?.description),
    pageCount: book.volumeInfo?.pageCount || 0,
    publishedDate: book.volumeInfo?.publishedDate || '',
    categories: book.volumeInfo?.categories || [],
    thumbnail:
      book.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
    averageRating: book.volumeInfo?.averageRating || 0,
    ratingsCount: book.volumeInfo?.ratingsCount || 0,
    status: undefined,
    userRating: undefined,
    $updatedAt: undefined,
  };
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

/**
 * Cleans book descriptions by removing HTML tags and normalizing content
 * @param {string} description - The HTML-formatted description text from Google Books API
 * @returns {string} - Clean description with HTML tags removed
 */
export const cleanBookDescription = (
  description: string | undefined
): string => {
  if (!description) return '';

  // Remove HTML tags
  let cleanText = description.replace(/<[^>]*>/g, '');

  // Replace common HTML entities
  cleanText = cleanText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...');

  // Normalize whitespace (replace multiple spaces, newlines, tabs with single space)
  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  return cleanText;
};

export const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PROFILE_PICS_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};
