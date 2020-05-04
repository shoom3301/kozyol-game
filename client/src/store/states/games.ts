import { GameItem } from 'model/GameItem';

export interface GamesState {
  games: GameItem[]
}

export const defaultGamesState: GamesState = {games: []}
