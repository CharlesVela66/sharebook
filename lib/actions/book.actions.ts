'use server';

import { BookResponse } from '@/types';
import { z } from 'zod';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

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

export const getUserBooksByStatus = async ({
  userId,
  bookStatus,
}: {
  userId: string;
  bookStatus?: string;
}) => {
  try {
    // Get the admin client and API key
    const { databases } = await createAdminClient();
    const apiKey = process.env.GOOGLE_BOOKS_API;

    if (!apiKey) {
      throw new Error('Google Books API key is not configured');
    }

    // Build queries for Appwrite
    const queries = [Query.equal('userId', [userId])];
    if (bookStatus) {
      queries.push(Query.equal('status', [bookStatus]));
    }

    // Get user's book activities from Appwrite
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookActivityCollectionId,
      queries
    );

    // If no books found, return empty array
    if (result.documents.length === 0) {
      return { success: true, books: [] };
    }

    // Extract book IDs and create a map for ratings
    const bookIds = result.documents.map((doc: any) => doc.bookId);
    const userRatings = new Map(
      result.documents.map((doc: any) => [doc.bookId, doc.rating])
    );

    // Fetch books from Google Books API in batches
    const batchSize = 10; // Google Books API allows up to 10 volumes per request
    const bookBatches = [];

    for (let i = 0; i < bookIds.length; i += batchSize) {
      const batchIds = bookIds.slice(i, i + batchSize);
      const batchPromises = batchIds.map(async (id) => {
        const url = new URL(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        url.searchParams.append('key', apiKey);

        const response = await fetch(url.toString(), {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch book ${id}: ${response.statusText}`);
          return null;
        }

        return response.json();
      });

      const batchResults = await Promise.all(batchPromises);
      bookBatches.push(...batchResults.filter(Boolean));
    }

    // Transform the books data
    const books = bookBatches.map((book: BookResponse) => ({
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
      userRating: userRatings.get(book.id) || 0, // Add user's rating
    }));

    return { success: true, books };
  } catch (error) {
    console.error('Error fetching user books:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch user books',
    };
  }
};

export const getUserBookActivity = async ({
  userId,
  bookId,
}: {
  userId: string;
  bookId?: string;
}) => {
  try {
    const { databases } = await createAdminClient();
    const apiKey = process.env.GOOGLE_BOOKS_API;

    if (!apiKey) {
      throw new Error('Google Books API key is not configured');
    }

    // Build queries for Appwrite
    const queries = [Query.equal('userId', [userId])];
    queries.push(Query.orderDesc('$updatedAt'));

    if (bookId) {
      queries.push(Query.equal('bookId', [bookId]));
    }

    // Get user's book activities from Appwrite
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookActivityCollectionId,
      queries
    );

    if (result.documents.length === 0) {
      return [];
    }

    // Extract book IDs and create a map for activities (status and rating)
    const bookIds = result.documents.map((doc: any) => doc.bookId);
    const userActivities = new Map(
      result.documents.map((doc: any) => [
        doc.bookId,
        { status: doc.status, rating: doc.rating },
      ])
    );

    // Fetch books from Google Books API
    const bookPromises = bookIds.map(async (id) => {
      const url = new URL(`https://www.googleapis.com/books/v1/volumes/${id}`);
      url.searchParams.append('key', apiKey);

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch book ${id}: ${response.statusText}`);
        return null;
      }

      const bookData = await response.json();
      const userActivity = userActivities.get(id);

      return {
        id: bookData.id,
        title: bookData.volumeInfo?.title || 'Untitled',
        authors: bookData.volumeInfo?.authors || [],
        description: bookData.volumeInfo?.description || '',
        pageCount: bookData.volumeInfo?.pageCount || 0,
        publishedDate: bookData.volumeInfo?.publishedDate || '',
        categories: bookData.volumeInfo?.categories || [],
        thumbnail:
          bookData.volumeInfo?.imageLinks?.thumbnail?.replace(
            'http:',
            'https:'
          ) || '',
        averageRating: bookData.volumeInfo?.averageRating || 0,
        ratingsCount: bookData.volumeInfo?.ratingsCount || 0,
        status: userActivity?.status || null,
        userRating: userActivity?.rating || 0,
      };
    });

    const books = (await Promise.all(bookPromises)).filter(Boolean);
    return books;
  } catch (error) {
    console.error('Error fetching book activity:', error);
    return [];
  }
};

export const setUserBookActivity = async ({
  userId,
  bookId,
  status,
  rating,
  type,
}: {
  userId: string;
  bookId: string;
  status?: string | null;
  rating?: number | null;
  type: 'create' | 'update';
}) => {
  try {
    const { databases } = await createAdminClient();

    if (type === 'create') {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookActivityCollectionId,
        ID.unique(),
        {
          userId,
          bookId,
          status,
          rating,
        }
      );
    } else {
      const document = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.bookActivityCollectionId,
        [Query.equal('userId', userId), Query.equal('bookId', bookId)]
      );
      const documentId = document.documents[0].$id;

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookActivityCollectionId,
        documentId,
        {
          status,
          rating,
        }
      );
    }
    revalidatePath('/');
    return { success: true, message: 'Book activity created successfully' };
  } catch (error) {
    console.error(error);
  }
};
