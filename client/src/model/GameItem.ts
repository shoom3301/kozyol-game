export interface GameItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    login: string;
  };
  slotsCount: number;
  players: any[];
}
