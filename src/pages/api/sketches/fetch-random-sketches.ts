import { NextApiRequest, NextApiResponse } from "next";
import config from "@/utils/config";
import fetchUniqueConceptKeyFromDynamoDb from "@/utils/aws/fetchUniqueConceptKeyFromDynamoDb";
import generateUniqueIds from "@/utils/randomness/generateUniqueIds";
import fetchItemsByIdsFromDynamoDb from "@/utils/aws/fetchItemsByIds";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    const min = 2;
    const max = 5;

    // Calculate the number of invalid and valid images
    const invalidCount = Math.floor(Math.random() * (max - min + 1)) + min;
    const validCount = config.imagesQuantity - invalidCount;

    const result = await fetchUniqueConceptKeyFromDynamoDb();

    if (!result) {
      return res.json([]);
    }

    const shuffledConcepts = Object.entries(result).sort(
      () => Math.random() - 0.5
    );

    const validConcepts = [];
    const invalidConcepts = [];

    let validSum = 0;
    let invalidSum = 0;

    // Fill the arrays with concepts that summed has enough items to fill the grid
    for (const [concept, count] of shuffledConcepts) {
      if (validSum < validCount) {
        validConcepts.push(concept);
        validSum += count;
      } else if (invalidSum < invalidCount) {
        invalidConcepts.push(concept);
        invalidSum += count;
      } else {
        break;
      }
    }

    // Generate unique ids for concepts, it's also an id in the database
    const validIds = generateUniqueIds(validConcepts, result, validCount);
    const invalidIds = generateUniqueIds(invalidConcepts, result, invalidCount);

    // Fetch database object from genereated ids
    const validItems = await fetchItemsByIdsFromDynamoDb(validIds);
    const invalidItems = await fetchItemsByIdsFromDynamoDb(invalidIds);

    // Tag validItems with valid: true
    const validImages = validItems.map((item) => ({
      ...item,
      valid: true,
    }));

    // Tag invalidItems with valid: false
    const invalidImages = invalidItems.map((item) => ({
      ...item,
      valid: false,
    }));

    // Merge valid and invalid images and shuffle them
    const images = [...validImages, ...invalidImages].sort(
      () => Math.random() - 0.5
    );

    return res
      .setHeader("Cache-Control", "no-store")
      .json({ images, validConcepts });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
