"use server";

import { createAdminClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache"; // FROM node_modules/next/cache.d.ts

// This Callback is copied and pasted from user.actions.ts (where it was originally created)
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// 1st file.action utility function??
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
};
// The 1st catch() belongs to .creatDocument() and the last catch() belongs to try/catch block
