"use server";

import { createAdminClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache"; // FROM node_modules/next/cache.d.ts
import { getCurrentUser } from "@/lib/actions/user.actions";

// This Callback is copied and pasted from user.actions.ts (where it was originally created)
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// 1. To be implemented in FileUploader.tsx
export const uploadFile = async ({
  // These Props are destructured from UploadFileProps declared in types/index.d.ts file)
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  // create an admin session get access to storage and databases
  const { storage, databases } = await createAdminClient();
  try {
    // Read the file (check before uploading)
    // First create an inputFile that is implemented to create bucketFile << InputFile() is from appwrite. making a file ready for appwrite??
    const inputFile = InputFile.fromBuffer(file, file.name);
    // Second create a bucketFile in Appwrite >> ??? in appwrite storage bucket???  ---- BUCKET/STORAGE
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId, // which bucket it will belong to (where to store it)
      ID.unique(), // assign a new 'id' for this new file
      inputFile,
    );
    // Third == Attach other useful METADATA (description) to the uploading file (inputFile). They will be useful later when performing tasks >> retrieval, modification, delete etc.
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId, // this is === (accountId: accountId) << value of accountId is assigned to property named accountId
      users: [],
      bucketFileId: bucketFile.$id,
    };
    // Fourth create a new document (file) in databases  ---- DATABASE
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId, // changed from bucketId to databaseId
        appwriteConfig.filesTableId,
        ID.unique(),
        fileDocument,
      )
      // In case any error occurred during the process of creating a new file in the DB << trigger a catch
      .catch(async (error: unknown) => {
        // Delete the file from storge -- so no corrupted or missing info file will be stored in BUCKET?STORAGE
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create a file document");
      });
    revalidatePath(path); // What does this do?? refresh data
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload files");
  }
  // NOTE: The 1st catch() belongs to databasea.creatDocument() and the last catch() belongs to try/catch block
};

// Callback to be used in getFiles() method
const createQueries = (
  currentUser: Models.Document,
  /*
  types: string[],
  searchText: string,
  sort: string,
  limit?: number, */
) => {
  const queries = [
    // multiple different appwrite queries
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  /*
  // add more queries >> Search, Sort, Limits etc.
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }
  */
  return queries;
};

// 2. To be implemented in Sort.tsx
export const getFiles = async () => /* {

  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,


}: GetFilesProps
*/ {
  // To retrieve files from DB, 1st need access to DB
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser); //, types, searchText, sort, limit
    // console.log 1 -- displayed in Both console and terminal. Two objects "currentUser" and "queries"
    // console.log({ currentUser, queries });

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesTableId,
      queries,
    );
    // console.log 2 -- displayed in both console and terminal. One object "files"
    // console.log({ files });
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

// Go over this logic all the way to return of try block. The logic seems to be the same for most of these callbacks
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  // Access database
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesTableId,
      fileId,
      { name: newName },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename files");
  }
};
// Same as above
export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  // Access database
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesTableId,
      fileId,
      { users: emails },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update files");
  }
};
// Same as above
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  // Access database
  const { databases, storage } = await createAdminClient();

  try {
    // deleting from database
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesTableId,
      fileId,
    );
    // delete from storage as well
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to update files");
  }
};
