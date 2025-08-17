export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION!,
  bookActivityCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_BOOK_ACTIVITY_COLLECTION!,
  friendRequestCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_USER_FRIEND_REQUEST_COLLECTION!,
  profilePicsBucketId: process.env.NEXT_PUBLIC_APPWRITE_PROFILE_PICS_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_SECRET!,
};
