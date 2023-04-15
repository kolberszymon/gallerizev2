interface Config {
  imagesQuantity: number;
  invalidTagPenalty: number;
  validTagPenalty: number;
  reward: number;
}

const config: Config = {
  imagesQuantity: 16,
  invalidTagPenalty: 0.06,
  validTagPenalty: 0.03,
  reward: 0.04,
};

export default config;
