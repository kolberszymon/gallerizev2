import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import config from "@/utils/config";
import updateImagesInvalidTagsCount from "@/utils/aws/updateImagesInvalidTagsCount";
import getCookies from "@/utils/getCookies";

// Best way to weight the output is to multiply gallerize-user-id-weight

// First things first, we need to check if he selected all invalid ones
// If he did, there's a good chance that he's thinking

// Then we need to check how many valid ones he tagged as invalid
// If he tagged more than 2, we need to increase their count, but also
// decrease his weight

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "This method is not allowed" });
    }

    // Create a cookies instance
    const cookies = new Cookies(req, res);

    const { userId, userWeight } = getCookies(cookies);

    if (!userId) {
      return res.status(400).json({ message: "User id not found" });
    }

    let penalty = 0;

    const { taggedImages, invalidIdsCount } = req.body;

    const validImages = taggedImages.filter((image: any) => image.valid);

    const invalidImagesTaggedCount = taggedImages.filter(
      (image: any) => !image.valid
    ).length;

    // If the user tagged all invalid images, we need to increase his weight
    // It means that he's thinking
    if (
      invalidImagesTaggedCount === invalidIdsCount &&
      taggedImages.length === invalidImagesTaggedCount
    ) {
      return res.json({ reward: config.reward });
    }

    penalty +=
      (invalidIdsCount - invalidImagesTaggedCount) * config.invalidTagPenalty;

    if (validImages.length > 1) {
      penalty += (validImages.length - 1) * config.validTagPenalty;
    }

    await updateImagesInvalidTagsCount(
      validImages,
      Number(userWeight) * (1 - penalty)
    );

    return res.json({ penalty: 1 - penalty });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default handler;
