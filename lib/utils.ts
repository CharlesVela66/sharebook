import { Book, BookResponse, FormType, User } from '@/types';
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

/**
 * Formats a date string to MMM YYYY format (e.g., "Mar 2025")
 * @param {string} dateString - Date string in ISO format (e.g., "2025-03-07T23:43:42.951+00:00")
 * @returns {string} Formatted date in MMM YYYY format
 */
export enum formatDateOptions {
  'MMM-YYYY',
  'MMMM-DD-YYYY',
}
export const formatDate = ({
  dateString,
  option = formatDateOptions['MMM-YYYY'],
}: {
  dateString: string;
  option: formatDateOptions;
}) => {
  const date = new Date(dateString);

  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  switch (option) {
    case formatDateOptions['MMM-YYYY']:
      return utcDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    case formatDateOptions['MMMM-DD-YYYY']:
      return utcDate.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
  }
};

/**
 * Calculates the time difference between now and a given date
 * Returns a human-readable string (e.g., "5s", "5min", "5h", "5d", "5w", "5m", "5y")
 * @param {string} dateString - Date string in ISO format (e.g., "2025-03-07T23:43:42.951+00:00")
 * @returns {string} Human-readable time difference
 */
export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // Less than a month (approximating a month as 30 days)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}m`;
  }

  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y`;
};

export const transformToUser = (userDoc: any): User | null => {
  if (!userDoc) return null;

  return {
    $id: userDoc.$id || '',
    name: userDoc.name || '',
    email: userDoc.email || '',
    profilePic: userDoc.profilePic || '',
    username: userDoc.username || '',
    dateOfBirth: userDoc.dateOfBirth || '',
    country: userDoc.country || '',
    createdAt: userDoc.$createdAt || '',
    readingGoal: userDoc.readingGoal || null,
  };
};
