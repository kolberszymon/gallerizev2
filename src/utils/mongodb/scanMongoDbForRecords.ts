import { ConceptInfo } from "@/types/ConceptInfo";
import { Item } from "@/types/Item";
import getMongoClient from "../globals/mongoDbGlobal";

const inputTable = process.env.MONGODB_INPUT_TABLE_NAME as string;
const conceptTable = process.env.MONGODB_CONCEPTS_INFO_TABLE_NAME as string;

export default async function scanMongoDbForRecords(
  validConcept: string,
  invalidConcept: string
): Promise<[Item[], Item[]]> {
  const start = new Date();

  console.log("concept");
  console.log(validConcept, invalidConcept);

  const db = await getMongoClient();

  const inputCollection = db.collection(inputTable);

  const inputFields = { concept: 1, id: 1, stim_url: 1 };

  const filter = {
    $and: [
      { concept: { $in: [validConcept, invalidConcept] } }, // Replace with your desired concept_name values
      { blank: { $ne: true } },
    ],
  };

  try {
    const inputResult = await inputCollection
      .find(filter)
      .project(inputFields)
      .toArray();

    const end = new Date();
    const runtime = Number(end) - Number(start);

    console.log(inputResult);

    console.log("Time of fetching RECORDS function:", runtime);

    const returnValue = {
      validItems: inputResult.filter((item) => validConcept === item.concept),
      invalidItems: inputResult.filter(
        (item) => invalidConcept === item.concept
      ),
    };

    return [
      returnValue.validItems as Item[],
      returnValue.invalidItems as Item[],
    ];
  } catch (err) {
    console.error("Error saving item to DynamoDB:", err);
    return [[], []];
  }
}
