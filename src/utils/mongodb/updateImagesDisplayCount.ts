import { Image } from "@/types/Image";
import getMongoClient from "@/utils/globals/mongoDbGlobal";

const inputTable = process.env.MONGODB_INPUT_TABLE_NAME as string;

async function updateImageDisplayCount(item: Image) {
  const db = await getMongoClient();

  const collection = db.collection(inputTable);
  const filter = { id: item.id };
  const update = { $inc: { display_count: 1 } };

  try {
    await collection.updateOne(filter, update);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

const updateImagesDisplayCount = async (items: Image[]) => {
  console.log("UPDATING IMAGES DISPLAY COUNT...");

  try {
    for (const item of items) {
      await updateImageDisplayCount(item);
    }
  } catch (error) {
    console.error("Error while updating:", error);
  }
};

export default updateImagesDisplayCount;
