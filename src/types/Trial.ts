import { Concepts } from "@/types/Concepts";
export interface Trial {
  userId: string;
  id: string;
  firstClickTime: number;
  lastClickTime: number;
  concepts: Concepts;
  images: {
    imageId: string;
    valid: boolean;
    selected: boolean;
  }[];
}
