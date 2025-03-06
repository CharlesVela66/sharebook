/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { BookResponse } from '@/types';
import { z } from 'zod';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { transformBookResponse } from '../utils';

const API_KEY = process.env.GOOGLE_BOOKS_API!;

// We use zod to validate the input value
const searchSchema = z.object({
  searchTerm: z.string().min(1, 'Search term cannot be empty'),
});

export const getBooksBySearchTerm = async ({
  searchTerm,
  maxResults,
  userId,
}: {
  searchTerm: string;
  maxResults?: number;
  userId?: string;
}) => {
  try {
    if (!API_KEY) {
      throw new Error('Google Books API key is not configured');
    }

    const validated = searchSchema.parse({ searchTerm });

    const url = new URL('https://www.googleapis.com/books/v1/volumes');

    url.searchParams.append('q', validated.searchTerm);
    url.searchParams.append('maxResults', maxResults?.toString() || '20');
    url.searchParams.append('orderBy', 'relevance');
    url.searchParams.append('printType', 'books');
    url.searchParams.append('key', API_KEY);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data.items exists before trying to iterate
    if (!data.items || !Array.isArray(data.items)) {
      return { success: true, books: [] };
    }

    const bookMap = new Map();

    const books = await Promise.all(
      data.items.map(async (book: BookResponse) => {
        const title = book.volumeInfo?.title?.toLowerCase().trim() || '';
        if (!title) return null;

        const existingBook = bookMap.get(title);
        const currentBook = transformBookResponse(book);

        if (userId) {
          const bookActivity = await getUserBookActivity({
            userId: userId,
            bookId: currentBook.id,
          });
          currentBook.userRating = bookActivity
            ? bookActivity.userRating
            : null;
          currentBook.status = bookActivity ? bookActivity.status : null;
        }

        if (!existingBook) {
          bookMap.set(title, currentBook);
          return currentBook;
        }

        if (
          currentBook.averageRating > existingBook.averageRating ||
          (currentBook.averageRating === existingBook.averageRating &&
            currentBook.ratingsCount > existingBook.ratingsCount)
        ) {
          bookMap.set(title, currentBook);
        }

        return null;
      })
    );

    return { success: true, books: books.filter((b) => b !== null) };
  } catch (error) {
    console.error(error);
    return { success: false, books: [] };
  }
};

export const getBookById = async ({
  bookId,
  userId,
}: {
  bookId: string;
  userId?: string;
}) => {
  try {
    const url = new URL(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );
    url.searchParams.append('key', API_KEY);

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

    const data = await response.json();

    const book = transformBookResponse(data);

    if (userId) {
      const bookActivity = await getUserBookActivity({
        userId: userId,
        bookId: bookId,
      });
      book.userRating = bookActivity!.userRating;
      book.status = bookActivity!.status;
    }

    return { success: true, book: book };
  } catch (error) {
    console.error(error);
    return { success: false, book: [] };
  }
};

export const getUserBookActivity = async ({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const queries = [
      Query.equal('userId', [userId]),
      Query.equal('bookId', [bookId]),
    ];

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookActivityCollectionId,
      queries
    );

    // If no activity found, return null
    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserActivity = async ({
  userId,
  status,
}: {
  userId: string;
  status?: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    // Build queries for Appwrite
    const queries = [Query.equal('userId', [userId])];
    queries.push(Query.orderDesc('$updatedAt'));
    if (status) {
      queries.push(Query.equal('status', [status]));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookActivityCollectionId,
      queries
    );

    // If no books found, return empty array
    if (response.documents.length === 0) {
      return { success: true, books: [] };
    }

    // Extract book IDs and create a map for ratings
    const bookIds = response.documents.map((doc: any) => doc.bookId);
    const userRatings = new Map(
      response.documents.map((doc: any) => [doc.bookId, doc.rating])
    );
    const userStatus = new Map(
      response.documents.map((doc: any) => [doc.bookId, doc.status])
    );

    const updatedAt = new Map(
      response.documents.map((doc: any) => [doc.bookId, doc.$updatedAt])
    );

    // Use Promise.all to wait for all async operations to complete
    const books = await Promise.all(
      bookIds.map(async (id: string) => {
        const result = await getBookById({ bookId: id });
        if (result.success && result.book && !Array.isArray(result.book)) {
          result.book.userRating = userRatings.get(id) || 0;
          result.book.status = userStatus.get(id) || '';
          result.book.$updatedAt = updatedAt.get(id) || '';
          return result.book;
        }
        return null;
      })
    );

    return { success: true, books: books };
  } catch (error) {
    console.error(error);
    return { success: false, books: [] };
  }
};

export const getUserFeed = async ({ userId }: { userId: string }) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', [userId])]
    );

    if (!response) throw new Error('Failed to fetch the user');

    const user = response.documents[0];
    const friendIds = user.friendIds || [];

    const userActivity = await getUserActivity({ userId: userId });

    const feed = [
      {
        userId: userId,
        userName: user.name,
        userProfilePic: user.profilePic,
        books: userActivity.success ? userActivity.books : [],
      },
    ];

    // Get all friends' activities
    if (friendIds.length > 0) {
      // Fetch all friend user documents first
      const friendsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('$id', friendIds)]
      );

      const friendUsers = friendsResponse.documents;

      // Create a map for easy access to friend details
      const friendMap: Record<string, any> = {};
      friendUsers.forEach((friend) => {
        friendMap[friend.$id] = friend;
      });

      // Use Promise.all to fetch all friend activities concurrently
      const friendActivities = await Promise.all(
        friendIds.map(async (friendId: string) => {
          try {
            const friendActivity = await getUserActivity({ userId: friendId });
            const friend = friendMap[friendId];

            return {
              userId: friendId,
              userName: friend?.name || 'Friend',
              userProfilePic: friend?.profilePic || '/images/profile-pic.png',
              books: friendActivity.success ? friendActivity.books : [],
            };
          } catch (error) {
            console.error(
              `Error fetching activity for friend ${friendId}:`,
              error
            );
            return {
              userId: friendId,
              userName: 'Friend',
              userProfilePic: '/images/profile-pic.png',
              books: [],
            };
          }
        })
      );

      // Add friends' activities to the feed
      feed.push(...friendActivities);
    }

    const sortedFeed = feed
      .filter((item) => item.books.length > 0) // Remove empty activities
      .sort((a, b) => {
        const aTime = a.books[0]?.$updatedAt || 0;
        const bTime = b.books[0]?.$updatedAt || 0;
        return bTime - aTime; // Sort descending (newest first)
      });
    return { success: true, feed: sortedFeed };
  } catch (error) {
    console.error(error);
    return { success: false, feed: [] };
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
