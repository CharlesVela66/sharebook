import { Query } from 'node-appwrite';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { transformToUser } from '../utils';

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

    const friends = response.documents.map(async (doc) => {
      const id = doc.senderId === userId ? doc.receiverId : doc.senderId;
      const userQueries = [Query.equal('$id', id)];
      if (searchTerm) {
        userQueries.push(
          Query.or([
            Query.equal('name', searchTerm),
            Query.equal('username', searchTerm),
          ])
        );
      }

      const friend = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userQueries
      );
      return transformToUser(friend.documents[0]);
    });

    return { success: true, friends: friends };
  } catch (error) {
    console.error(error);
    return { success: false, friends: [] };
  }
};
