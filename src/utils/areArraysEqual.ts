import { RandomImage } from "@/types/Image";

export default function areArraysEqual(
  arr1: RandomImage[],
  arr2: RandomImage[]
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    if (obj1.id !== obj2.id) {
      return false;
    }
  }

  return true;
}
