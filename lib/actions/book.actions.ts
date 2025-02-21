'use server';

import { BookResponse } from '@/types';
import { z } from 'zod';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { Query } from 'node-appwrite';

// We use zod to validate the input value
const searchSchema = z.object({
  searchTerm: z.string().min(1, 'Search term cannot be empty'),
});

// Get Books from the API by search term
export const getBooks = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    // Validate the input
    const validated = searchSchema.parse({ searchTerm });

    // Retrieve the API KEY
    const apiKey = process.env.GOOGLE_BOOKS_API;

    // If there's an issue with the API Key send and error
    if (!apiKey) {
      throw new Error('Google Books API key is not configured');
    }

    // Construct the URL for the API
    const url = new URL('https://www.googleapis.com/books/v1/volumes');
    // Search term
    url.searchParams.append('q', validated.searchTerm);
    // Max results
    url.searchParams.append('maxResults', '20');
    // Order by relevance
    url.searchParams.append('orderBy', 'relevance');
    // Only books
    url.searchParams.append('printType', 'books');
    // Append the key for authorization
    url.searchParams.append('key', apiKey);

    // Make the GET request to the API
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    // If there is an issue with the response, send an error
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    // Transform the data to a json format
    const data = await response.json();

    // Create a book map to don't repeat book titles
    const bookMap = new Map();

    // Iterate over the whole data to save unique book titles
    data.items.forEach((book: BookResponse) => {
      const title = book.volumeInfo?.title?.toLowerCase().trim() || '';
      const existingBook = bookMap.get(title);

      // Skip empty titles
      if (!title) return;

      const currentBook = {
        id: book.id,
        title: book.volumeInfo?.title || 'Untitled',
        authors: book.volumeInfo?.authors || [],
        description: book.volumeInfo?.description || '',
        pageCount: book.volumeInfo?.pageCount || 0,
        publishedDate: book.volumeInfo?.publishedDate || '',
        categories: book.volumeInfo?.categories || [],
        thumbnail:
          book.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') ||
          '',
        averageRating: book.volumeInfo?.averageRating || 0,
        ratingsCount: book.volumeInfo?.ratingsCount || 0,
      };

      if (!existingBook) {
        bookMap.set(title, currentBook);
        return;
      }

      // If there is a duplicate, keep the book with the highest rating
      if (
        currentBook.averageRating > existingBook.averageRating ||
        (currentBook.averageRating === existingBook.averageRating &&
          currentBook.ratingsCount > existingBook.ratingsCount)
      ) {
        bookMap.set(title, currentBook);
      }
    });

    // Convert map back to array
    const books = Array.from(bookMap.values());

    return { success: true, books };
  } catch (error) {
    console.error('Error fetching books:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch books',
    };
  }
};

export const getUserFeed = async ({ userId }: { userId: string }) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookActivityCollectionId,
    [Query.equal('userId', userId)]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const getAllUserBooks = async ({ userId }: { userId: string }) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookActivityCollectionId,
    [Query.equal('userId', [userId])]
  );
  return result;
};

export const getUserBooksByStatus = async ({
  userId,
  bookStatus,
}: {
  userId: string;
  bookStatus: string;
}) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookActivityCollectionId,
    [Query.equal('userId', [userId]), Query.equal('status', [bookStatus])]
  );
  return result;
};
