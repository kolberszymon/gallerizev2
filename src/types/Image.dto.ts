export type Image = {
  id: string;
  filename_prod: string;
  filename_recog: string;
  concept: string;
  iteration: string;
  stim_url: string;
  invalidTagsCount?: number;
};
