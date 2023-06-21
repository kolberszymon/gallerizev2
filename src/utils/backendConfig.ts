export type ConceptInfo = {
  concept_name: string;
  display_count: number;
};

export type Input = {
  id: string;
  concept: string;
  display_count: number;
  filename: string;
  invalidTagsCount: number;
  stim_url: string;
  blank: boolean;
};

type Trial = {
  firstClickTime: number;
  lastClickTime: number;
  invalidConcept: string;
  validConcept: string;
  images: { imageId: string; selected: boolean; valid: boolean }[];
};

export type Output = {
  userId: string;
  trials: Trial[];
};
