import { v4 as uuidv4 } from "uuid";
import { UserDocument } from "@shared";
import { databaseClient } from "./database";
import { Collection } from "mongodb";

function collection(): Collection<UserDocument> {
  return databaseClient.db(process.env.MONGODB_DATABASE).collection<UserDocument>("users");
}

export async function createUser(githubUserId: number, name: string): Promise<UserDocument> {
  const user: UserDocument = {
    id: uuidv4(),
    name,
    tokenVersion: 0,
    githubUserId: githubUserId.toString(),
  };

  const result = await collection().insertOne(user);
  if (result.acknowledged) return user;
  throw new Error();
}

export async function getGithubUserByGithubId(githubUserId: number): Promise<UserDocument | null> {
  return await collection().findOne({ githubUserId: githubUserId.toString() });
}

export async function getUserById(id: string): Promise<UserDocument | null> {
  return await collection().findOne({ id });
}
