/*
Explanation of proposed algorithm:
Since we're counting user tag weigth, which is a number between 0 and 1, we need to
multiply it by 100

so 100 outright votes equals 10000 invalidTagsCount
*/

import { Image } from "@/types/Image";
import getMongoClient from "../globals/mongoDbGlobal";

const inputTable = process.env.MONGODB_INPUT_TABLE_NAME as string;

async function updateSingleInvalidTagsCount(item: Image, incrementBy: number) {
  const db = await getMongoClient();

  const collection = db.collection(inputTable);
  const filter = { id: item.id };
  const update = { $inc: { invalidTagsCount: incrementBy } };

  try {
    await collection.updateOne(filter, update);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

const updateImagesInvalidTagsCount = async (items: Image[], weight: number) => {
  console.log("UPDATING IMAGES INVALID TAGS COUNT...");

  try {
    for (const item of items) {
      const adjustedInvalidCount = Math.round(weight * 100);

      await updateSingleInvalidTagsCount(item, adjustedInvalidCount);
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateImagesInvalidTagsCount;
