import { NextApiRequest, NextApiResponse } from "next";
import config from "@/utils/config";
import scanDynamoDbForRecords from "@/utils/aws/scanDynanoDbForRecords";
import getCookiesServer from "@/utils/getCookiesServer";
import getRandomWeightedConcept from "@/utils/randomness/getRandomConcept";
import getRandomWeightedItems from "@/utils/randomness/getRandomItems";
import Cookies from "cookies";
import Chance from "chance";

const chance = new Chance();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    console.log("SERVER: Fetching random sketches...");

    const cookies = new Cookies(req, res);

    const { selectedConcept } = getCookiesServer(cookies);

    // // Calculate the number of invalid and valid images
    const invalidCount = chance.weighted([0, 1, 2], [0.25, 0.5, 0.25]);
    const validCount = config.imagesQuantity - invalidCount;

    const [items, conceptsQuantity] = await scanDynamoDbForRecords();

    if (!conceptsQuantity) {
      return res.json([]);
    }

    // Select random concept

    let validConcept: string, invalidConcept: string;

    if (!selectedConcept) {
      validConcept = getRandomWeightedConcept(conceptsQuantity);
      cookies.set("gallerize-selected-concept", validConcept, {
        expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      });
    } else {
      validConcept = selectedConcept;
    }

    invalidConcept = getRandomWeightedConcept(conceptsQuantity, validConcept);

    console.log("Number of invalid images: ", invalidCount);
    console.log("Valid Concept: ", validConcept);
    console.log("Invalid concept: ", invalidConcept);
    console.log("--------------------");

    const validItems = items.filter((item) => validConcept === item.concept);
    const invalidItems = items.filter(
      (item) => invalidConcept === item.concept
    );

    const validImages = getRandomWeightedItems(validItems, validCount, true);
    const invalidImages = getRandomWeightedItems(
      invalidItems,
      invalidCount,
      false
    );

    // Merge valid and invalid images and shuffle them
    const allImages = [...validImages, ...invalidImages].sort(
      () => Math.random() - 0.5
    );

    return res
      .setHeader("Cache-Control", "no-store")
      .json({ allImages, validConcept, invalidConcept });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
