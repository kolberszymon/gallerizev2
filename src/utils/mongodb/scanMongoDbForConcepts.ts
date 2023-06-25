import { ConceptInfo } from "@/types/ConceptInfo";

import getMongoClient from "../globals/mongoDbGlobal";

const conceptTable = process.env.MONGODB_CONCEPTS_INFO_TABLE_NAME as string;

export default async function scanMongoDbForConcepts(): Promise<ConceptInfo[]> {
  const start = new Date();

  const db = await getMongoClient();

  const conceptCollection = db.collection(conceptTable);

  const conceptsFields = { concept_name: 1, display_count: 1 };

  try {
    const conceptResult = await conceptCollection
      .find({})
      .project(conceptsFields)
      .toArray();

    const end = new Date();
    const runtime = Number(end) - Number(start);

    console.log("Time of fetching function:", runtime);

    return (conceptResult as ConceptInfo[]) || [];
  } catch (err) {
    console.error("Error saving item to DynamoDB:", err);
    return [];
  }
}
