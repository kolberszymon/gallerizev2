import { RandomImage } from "@/types/Image";
import getUserCookies from "@/utils/getUserCookie";
//@ts-ignore
import cookieCutter from "cookie-cutter";

export const saveAnswer = async (
  randomImages: RandomImage[],
  markedImagesIds: number[],
  invalidIds: number[],
  invalidConcept: string
) => {
  const taggedImages = randomImages
    .map((image, i) => {
      if (markedImagesIds.includes(i)) {
        return image;
      }
    })
    .filter((i) => i !== undefined);

  const { userId, userWeight } = getUserCookies();

  const headers = {
    "Content-Type": "application/json",
    cookie: `user-id=${userId}, gallerize-user-id-weight=${userWeight}'`,
  };

  const response = await fetch(`/api/sketches/save-answer`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      randomImages,
      taggedImages,
      invalidIdsCount: invalidIds.length,
      invalidConcept,
    }),
  });

  const { penalty, reward } = await response.json();

  const currentWeight = cookieCutter.get("gallerize-user-id-weight");

  if (reward) {
    if (currentWeight < 1 - reward) {
      cookieCutter.set(
        "gallerize-user-id-weight",
        Number(currentWeight) + Number(reward)
      );
    } else {
      cookieCutter.set("gallerize-user-id-weight", 1);
    }
  } else {
    cookieCutter.set("gallerize-user-id-weight", currentWeight * penalty);
  }

  return;
};
