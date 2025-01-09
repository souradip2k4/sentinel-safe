export const getRisk = (
  speed: number,
  people: number,
  lumen: boolean
): number => {
  const offset = 1;
  if (people <= 5) people *= 4;
  let riskRating = people / (+lumen + 1 + (1 / speed + 1));
  riskRating = 4 / (1 + Math.exp(-(riskRating - offset))) + 1;
  return riskRating;
};
