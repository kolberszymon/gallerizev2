import { ConceptInfo } from "@/types/ConceptInfo";
import { Item } from "@/types/Item";
import getMongoClient from "../globals/mongoDbGlobal";

const inputTable = process.env.MONGODB_INPUT_TABLE_NAME as string;
const conceptTable = process.env.MONGODB_CONCEPTS_INFO_TABLE_NAME as string;

export default async function scanMongoDbForRecords(): Promise<
  [Item[], ConceptInfo[]]
> {
  const db = await getMongoClient();

  const inputCollection = db.collection(inputTable);
  const conceptCollection = db.collection(conceptTable);

  const inputFields = { concept: 1, id: 1, stim_url: 1 };
  const conceptsFields = { concept_name: 1, display_count: 1 };

  const nonBlankFilter = { blank: { $ne: true } };

  try {
    const inputResult = await inputCollection
      .find(nonBlankFilter)
      .project(inputFields)
      .toArray();

    const conceptResult = await conceptCollection
      .find({})
      .project(conceptsFields)
      .toArray();

    return [
      (inputResult as Item[]) || [],
      (conceptResult as ConceptInfo[]) || [],
    ];
  } catch (err) {
    console.error("Error saving item to DynamoDB:", err);
    return [[], []];
  }
}
