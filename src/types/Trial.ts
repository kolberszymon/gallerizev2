export interface Trial {
  userId: string;
  id: string;
  firstClickTime: number;
  lastClickTime: number;
  images: {
    imageId: string;
    valid: boolean;
    selected: boolean;
  }[];
}
