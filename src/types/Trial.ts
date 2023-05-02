export interface Trial {
  userId: string;
  id: string;
  firstClickTime: number;
  lastClickTime: number;
  validConcept: string;
  invalidConcept: string;
  images: {
    imageId: string;
    valid: boolean;
    selected: boolean;
  }[];
}
