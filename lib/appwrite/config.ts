export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersTableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE!,
  filesTableId: process.env.NEXT_PUBLIC_APPWRITE_FILES_TABLE!, // changed _FILE_TABLE! to _FILES_TABLE!
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!, // changed _APPWRITE_SECRET! to _APPWRITE_KEY!
};
/* The ending exclamation point is called a "non-null assertion operator",
 It assures TypeScript that the value is NOT null or UNDEFINED
 Assures it has a value and to override TypeScript safety checks
 */
