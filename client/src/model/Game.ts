export interface Game {
  id: string;
  owner: {
    id: string;
    login: string;
  };
  slotsCount: number;
  playersCount: number;
}
