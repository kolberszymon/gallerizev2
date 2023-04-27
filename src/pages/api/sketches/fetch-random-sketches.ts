import { NextApiRequest, NextApiResponse } from "next";
import config from "@/utils/config";
import scanDynanoDbForRecords from "@/utils/aws/scanDynanoDbForRecords";
import shuffleProvidedImages from "@/utils/randomness/shuffleProvidedImages";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    console.log("SERVER: Fetching random sketches...");

    // Min & Max number of invalid images in the grid
    const min = 2;
    const max = 5;

    // Calculate the number of invalid and valid images
    const invalidCount = Math.floor(Math.random() * (max - min + 1)) + min;
    const validCount = config.imagesQuantity - invalidCount;

    const [items, conceptsQuantity] = await scanDynanoDbForRecords();

    if (!conceptsQuantity) {
      return res.json([]);
    }

    const shuffledConcepts = Object.entries(conceptsQuantity).sort(
      () => Math.random() - 0.5
    );

    const validConcepts: string[] = [];
    const invalidConcepts: string[] = [];

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

    const validItems = items.filter((item) =>
      validConcepts.includes(item.concept)
    );
    const invalidItems = items.filter((item) =>
      invalidConcepts.includes(item.concept)
    );

    const validImages = shuffleProvidedImages(validItems, validCount, true);
    const invalidImages = shuffleProvidedImages(
      invalidItems,
      invalidCount,
      false
    );

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
