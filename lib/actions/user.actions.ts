"use server";
// This DIRECTIVE in Next.js marks a 'file' OR a 'function' to run EXCLUSIVELY on the server, i.e., to enable 'server actions' and to secure 'backend logic'

import { createAdminClient, createSessionClient } from "@/lib/appwrite"; // From /lib/appwrite/index.ts
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { email } from "zod/v4";

// Callback #1
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient(); // databases object coming from destructured 'createAdminClient'

  const result = await databases.listDocuments(
    // return documents that matches databaseId and userTableId from a given email
    appwriteConfig.databaseId,
    appwriteConfig.usersTableId,
    [Query.equal("email", [email])], // This query filters the return values by GIVEN email (argument)
  );
  // Check if result has nay value and if it does, return the FIRST element of 'documents' ARRAY
  return result.total > 0 ? result.documents[0] : null;
};

// Callback #2
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// Callback #3 -- The argument == destructured object, for property 'email' the value can only be 'string'
export const sendEmailOTP = async ({ email }: { email: string }) => {
  //
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

// # 1 User enters full name and email
export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  // #2 - Check if the user already exist using the email (we will use this to identify if we still need to create a user document or not
  const existingUser = await getUserByEmail(email);
  // NOTE: If 'getUserByEmail(email)' returns a value == has a user in the DB and need to get account using accountId. If the returned value == null, no user in DB

  // #3 - Send OTP to user emailName
  const accountId = await sendEmailOTP({ email }); // If a user exists in DB, it will return a value for accountId
  // No value for accountId == No user in DB
  if (!accountId) throw new Error("Failed to send an OTP");
  // No user exists in DB
  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersTableId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }
  return parseStringify({ accountId });
};

// To call in OTPModal to verify OTP
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
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
// To fetch current user from a session??
export const getCurrentUser = async () => {
  // First need access to databases and account from session client
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersTableId,
    [Query.equal("accountId", result.$id)], // return only the user whose queried accountId matches $id in results
  );

  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
};
/* Objective - create account flow
1. User enters full name and email
2. Check if the user already exist using the email (we will use this to identify if we still need to create a user document or not
3. Send OTP to user emailName
4. This will send a secret key for creating a session. The secret key or OTP will be sent to the user's account email. If the user's auth account has
5. Create a new user document if the user is a new user
6. Return the user;s accountId that will be used to complete the login
7. Verify OTP and authenticate to login
*/
