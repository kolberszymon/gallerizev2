import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI as string, {});
    await client.connect();
  }

  return client.db(process.env.MONGODB_DB_NAME);
}

export default getMongoClient;
