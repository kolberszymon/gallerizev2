import { RandomImage } from "@/types/Image";

export const colorResponse = (randomImages: RandomImage[]) => {
  const invalidIds = randomImages
    .map((image, i) => {
      if (!image.valid) {
        return i;
      }
    })
    .filter((i) => i);

  const markedImages = randomImages
    .map((image, i) => {
      if (image.selected) {
        return i;
      }
    })
    .filter((i) => i);

  // If user tagged all invalid images
  if (invalidIds.sort().join(",") === markedImages.sort().join(",")) {
    return "bg-green-200";
  }

  // If user tagged all invalid images AND more
  if (
    markedImages.sort().join(",").includes(invalidIds.sort().join(",")) &&
    markedImages.length > invalidIds.length
  ) {
    return "bg-yellow-200";
  }

  // If user have not tagged all invalid images
  return "bg-red-200";
};
