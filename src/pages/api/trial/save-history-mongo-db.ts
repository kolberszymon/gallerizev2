import { NextApiRequest, NextApiResponse } from "next";
import { Trial } from "@/types/Trial";
import getMongoClient from "@/utils/globals/mongoDbGlobal";

const outputTable = process.env.MONGODB_OUTPUT_TABLE_NAME as string;

async function pushTrial(trial: Trial) {
  const db = await getMongoClient();

  const newTrial = {
    firstClickTime: trial.firstClickTime,
    lastClickTime: trial.lastClickTime,
    validConcept: trial.concepts.validConcept,
    invalidConcept: trial.concepts.invalidConcept,
    images: trial.images,
  };

  const collection = db.collection(outputTable);

  const filter = { userId: trial.userId }; // Specify the filter for finding the document
  const update = { $push: { trials: newTrial } }; // Specify the update operation

  const options = { upsert: true }; // Enable upsert to create the document if it doesn't exist

  try {
    //@ts-ignore
    await collection.findOneAndUpdate(filter, update, options);
  } catch (error: any) {
    console.error("Error updating item:", error);
    return null;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    const trial = req.body;

    await pushTrial(trial);

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
