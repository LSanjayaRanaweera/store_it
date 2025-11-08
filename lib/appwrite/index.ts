"use server"; // To only run on the SERVER (backend logic to run on backend)

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

// 1. Establish communication CONNECTION between the project and appwrite (backend)
// Two types of clients can be created.
// A. A sessionClient that has access ONLY to specific set of data, e.g., like a logged-in user
export const createSessionClient = async () => {
  // Declare a client to communicate with backend - URL and ProjectId required
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  // Create a communication session
  // .get("appwrite-session) retrieves the value associated with cookie key and assign it to session, hence making 'session == (has) value'
  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) throw new Error("No session");

  client.setSession(session.value);

  return {
    // GETTERS for client - limited access to DB
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

// B. An adminClient that has access to the ENTIRE database
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey); // Requires "secretKey" to grant access to admin privileges

  return {
    // GETTERS for admin - full privileges granted with 'secretKey'
    // NOTE: 'Account', 'Databases', 'Storage' and 'Avatar' are GETTER objects brought in with "node-appwrite"
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    // These additional privileges (methods) are granted with ONLY secretKey (admin) access
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
/*
NOTE: lib/appwrite/index.ts file serves as a centralized configuration and SDK initializer for Appwrite services.
1. Create clients in the project to communicate with appwrite >> needs to pass a URL and a ProjectId in appwrite (arguments)
  A. Session client has similar access to a user has to his account
     After making a request (URL/Project), it requires to establish a client 'session'
  B. Admin client has full access to the database.
     Once access is established to DB (URL/Project/API_KEY), it can return the GETTERS.
     Hence, NO need to establish a session (as required in createSessionClient())
*/
