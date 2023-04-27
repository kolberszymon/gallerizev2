import { SetStateAction } from "react";

export const unmarkImage = (
  setMarkedImages: (value: SetStateAction<number[]>) => void,
  index: number
) => {
  setMarkedImages((prev) => prev.filter((i) => i !== index));
};

export const markImage = (
  setMarkedImages: (value: SetStateAction<number[]>) => void,
  index: number
) => {
  setMarkedImages((prev) => [...prev, index]);
};

export const resetMarkedImages = (
  setMarkedImages: (value: SetStateAction<number[]>) => void
) => {
  setMarkedImages([]);
};
