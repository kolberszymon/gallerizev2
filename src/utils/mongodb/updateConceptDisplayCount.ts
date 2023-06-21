import getMongoClient from "../globals/mongoDbGlobal";

const conceptTable = process.env.MONGODB_CONCEPTS_INFO_TABLE_NAME as string;

export async function updateConceptDisplayCount(concept_name: string) {
  console.log("UPDATING CONCEPT DISPLAY COUNT...");

  const db = await getMongoClient();

  const collection = db.collection(conceptTable);
  const filter = { concept_name };
  const update = { $inc: { display_count: 1 } };

  try {
    await collection.updateOne(filter, update);
  } catch (error) {
    console.error("Error updating concepts item:", error);
    throw error;
  }
}

const updateConceptsDisplayCount = async (concepts: string[]) => {
  console.log("UPDATING CONCEPT DISPLAY COUNT...");
  console.log(concepts);

  try {
    for (const concept of concepts) {
      await updateConceptDisplayCount(concept);
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateConceptsDisplayCount;
