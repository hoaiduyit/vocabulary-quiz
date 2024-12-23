export type ScoreboardType = {
  id: string;
  score: number;
  user: {
    id: string;
    displayName: string;
  };
};
