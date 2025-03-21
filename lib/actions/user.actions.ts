'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { constructFileUrl, parseStringify, transformToUser } from '../utils';
import { revalidatePath } from 'next/cache';
import { InputFile } from 'node-appwrite/file';
import { User, userProfilePictureProps } from '@/types';

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal('email', [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({
  name,
  email,
  username,
  dateOfBirth,
  country,
}: {
  name: string;
  email: string;
  username: string;
  dateOfBirth: string;
  country: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error('Failed to send an OTP');

  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        name,
        email,
        username,
        dateOfBirth,
        country,
        accountId,
      }
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', [result.$id])]
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    handleError(error, 'Failed to get current user');
  }
};

export const signOutUser = async () => {
  const { account } = await createAdminClient();
  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: 'User not found' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};

export const setReadingGoal = async ({
  userId,
  goal,
}: {
  userId: string;
  goal: number;
}) => {
  const { databases } = await createAdminClient();

  const result = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId,
    {
      readingGoal: goal,
    }
  );

  if (!result) throw new Error('Error at creating new reading goal');

  revalidatePath(`/profile/${userId}`);
  return { success: true, message: 'Reading goal updated successfully' };
};

export const uploadProfilePicture = async (
  currentUser: userProfilePictureProps
) => {
  const { id, name, profilePic, username, email, dateOfBirth, country } =
    currentUser;

  try {
    const { storage, databases } = await createAdminClient();

    const isNewFile = profilePic instanceof File;

    let profilePicUrl = profilePic;

    if (isNewFile) {
      const fileObject = profilePic as File;
      const arrayBuffer = await fileObject.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const inputFile = InputFile.fromBuffer(buffer, fileObject.name);
      const bucketFile = await storage.createFile(
        appwriteConfig.profilePicsBucketId,
        ID.unique(),
        inputFile
      );

      profilePicUrl = constructFileUrl(bucketFile.$id);
    }

    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      id,
      {
        name: name,
        profilePic: profilePicUrl,
        username: username,
        email: email,
        dateOfBirth: dateOfBirth,
        country: country,
      }
    );

    revalidatePath(`/profile/${id}`);
    return response;
  } catch (error) {
    console.error('Upload error:', error);
  }
};

export const getUsersBySearchTerm = async ({
  searchTerm,
  userId,
}: {
  searchTerm: string;
  userId: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    const documents = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.notEqual('$id', userId), Query.limit(100)]
    );

    if (documents.total === 0) {
      return { success: true, friends: [] };
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filteredUsers = documents.documents.filter((doc) => {
      const name = (doc.name || '').toLowerCase();
      const username = (doc.username || '').toLowerCase();

      return (
        name.includes(lowercaseSearchTerm) ||
        username.includes(lowercaseSearchTerm)
      );
    });

    const friends = filteredUsers.map((doc) => {
      return transformToUser(doc);
    });

    return { success: true, friends };
  } catch (error) {
    console.error('Error searching for users:', error);
    return { success: false, friends: [] };
  }
};

export const getUserById = async ({
  userId,
  searchTerm,
}: {
  userId: string;
  searchTerm?: string;
}): Promise<User | null> => {
  try {
    const { databases } = await createAdminClient();

    const userQueries = [Query.equal('$id', userId)];

    if (searchTerm) {
      userQueries.push(
        Query.or([
          Query.equal('name', searchTerm),
          Query.equal('username', searchTerm),
        ])
      );
    }

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userQueries
    );

    if (!user.documents.length) return null;

    return transformToUser(user.documents[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

export const getUsersById = async ({
  userIds,
  searchTerm,
}: {
  userIds: string[];
  searchTerm?: string;
}): Promise<User[]> => {
  try {
    const userPromises = userIds.map((id) =>
      getUserById({ userId: id, searchTerm })
    );

    const users = await Promise.all(userPromises);

    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    return [];
  }
};
