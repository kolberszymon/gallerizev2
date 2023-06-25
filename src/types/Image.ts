export type Image = {
  id: string;
  concept: string;
  filename: string;
  stim_url: string;
  invalidTagsCount?: number;
  valid?: boolean;
};

export type RandomImage = {
  valid: boolean;
  id: string;
  stim_url: string;
  concept: string;
  selected?: boolean;
  imageComponent: JSX.Element;
};
