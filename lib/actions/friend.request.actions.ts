'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { getUsersById } from './user.actions';

export const getUserFriends = async ({
  userId,
  searchTerm,
}: {
  userId: string;
  searchTerm?: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const queries = [
      Query.or([
        Query.equal('senderId', userId),
        Query.equal('receiverId', userId),
      ]),
      Query.equal('status', 'accepted'),
    ];

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendRequestCollectionId,
      queries
    );

    if (!response) {
      return { success: true, friends: [] };
    }

    const friendIds = response.documents.map((doc) =>
      doc.senderId === userId ? doc.receiverId : doc.senderId
    );

    const friends = await getUsersById({ userIds: friendIds, searchTerm });

    return { success: true, friends };
  } catch (error) {
    console.error(error);
    return { success: false, friends: [] };
  }
};

export const getUserFriendRequest = async ({
  userId,
  type,
}: {
  userId: string;
  type: 'sender' | 'receiver';
}) => {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendRequestCollectionId,
      [Query.equal(`${type}Id`, userId)]
    );

    if (!response) {
      return { success: true, friends: [] };
    }

    const friendIds = response.documents.map((doc) =>
      doc.senderId === userId ? doc.receiverId : doc.senderId
    );

    const friends = await getUsersById({ userIds: friendIds });

    return { success: true, friends };
  } catch (error) {
    console.error(error);
    return { success: false, friends: [] };
  }
};

export const checkExistingRequest = async ({
  userId1,
  userId2,
}: {
  userId1: string;
  userId2: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendRequestCollectionId,
      [
        Query.or([
          Query.and([
            Query.equal('senderId', userId1),
            Query.equal('receiverId', userId2),
          ]),
          Query.and([
            Query.equal('senderId', userId2),
            Query.equal('receiverId', userId1),
          ]),
        ]),
      ]
    );

    if (!response || response.documents.length === 0) {
      return { exists: false };
    }

    const request = response.documents[0];
    return {
      exists: true,
      status: request.status,
      senderId: request.senderId,
      receiverId: request.receiverId,
      documentId: request.$id,
    };
  } catch (error) {
    console.error('Error checking existing request:', error);
    return { exists: false };
  }
};

export const sendFriendRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    // First check if there's already a request between these users
    const existingRequest = await checkExistingRequest({
      userId1: senderId,
      userId2: receiverId,
    });

    if (existingRequest.exists) {
      // If the current user is the receiver of an existing pending request, accept it
      if (
        existingRequest.status === 'pending' &&
        existingRequest.receiverId === senderId
      ) {
        return await updateFriendRequestStatus({
          requestId: existingRequest.documentId!,
          status: 'accepted',
        });
      }

      // Otherwise, don't create a duplicate request
      return {
        success: false,
        message: 'A request already exists between these users',
      };
    }

    const { databases } = await createAdminClient();

    // Create a new friend request
    const newRequest = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendRequestCollectionId,
      ID.unique(),
      {
        senderId,
        receiverId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    return { success: true, data: newRequest };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return { success: false, message: 'Failed to send friend request' };
  }
};

export const updateFriendRequestStatus = async ({
  requestId,
  status,
}: {
  requestId: string;
  status: 'accepted' | 'declined';
}) => {
  try {
    const { databases } = await createAdminClient();

    const updatedRequest = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendRequestCollectionId,
      requestId,
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    );

    return { success: true, data: updatedRequest };
  } catch (error) {
    console.error('Error updating friend request:', error);
    return { success: false, message: 'Failed to update friend request' };
  }
};
