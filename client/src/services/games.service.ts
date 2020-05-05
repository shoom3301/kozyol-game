import axios from 'axios';
import { authService } from 'services/auth.service';
import { GameItem } from 'model/GameItem';
import { store } from 'store';
import { gameFetchAllSuccess } from 'store/actions/games';
import { apiUrl } from 'helpers/apiUrl';

export class GamesService {
  createGame(slotsCount: number): Promise<any> {
    return axios
      .post(apiUrl('/games/create'), { slotsCount }, { ...authService.withAuth() })
  }

  getList(): Promise<GameItem[]> {
    return axios
      .get<GameItem[]>(apiUrl('/games/list'), { ...authService.withAuth() })
      .then(({ data }) => data)
  }

  connectToGame(gameId: number): Promise<any> {
    return axios
      .post(apiUrl('/games/connect'), { gameId }, { ...authService.withAuth() })
      .then(res => res.data)
  }

  updateList(): Promise<void> {
    return this.getList().then(games => {
      store.dispatch(gameFetchAllSuccess(games))
    })
  }
}

export const gamesService = new GamesService()
