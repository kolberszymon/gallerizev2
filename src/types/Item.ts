export interface Item {
  id: string;
  concept: string;
  filename: string;
  sketchId: string;
  stim_url: string;
  display_count: number;
  valid?: boolean;
}
