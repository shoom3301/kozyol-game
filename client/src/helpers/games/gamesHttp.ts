import axios from 'axios';
import {Game} from 'model/Game';
import {GameBlank} from 'model/GameBlank';
import {authService} from 'services/auth.service';
import {GameState} from 'model/GameState';

export const API_GAME_PATH = '/api/game';
export const API_GAMES_PATH = '/api/games/list';

export function loadGamesList(): Promise<Game[]> {
    return axios.get(API_GAMES_PATH, {...authService.withAuth()})//.then(({data}) => data);
        .then(() => [
            {id: 'ssf23f2', owner: {id: '1', name: 'Galya'}, slotsCount: 4, playersCount: 2},
            {id: 'u3i4tg', owner: {id: '1', name: 'Misha'}, slotsCount: 2, playersCount: 0},
            {id: 'kf349w2', owner: {id: '1', name: 'Asylbek'}, slotsCount: 4, playersCount: 1},
            {id: 'k95jthire', owner: {id: '1', name: 'Ebtygydyk'}, slotsCount: 3, playersCount: 1}
        ])
}

export function loadGame(id: string): Promise<Game> {
    return Promise.resolve({id: 'kf349w2', owner: {id: '1', name: 'Asylbek'}, slotsCount: 4, playersCount: 1})
    // return axios.get(API_GAME_PATH, {...authService.withAuth(), params: {id}}).then(({data}) => data);
}

export function createGame(game: GameBlank): Promise<Game> {
    return axios.post(API_GAME_PATH, game, {...authService.withAuth()}).then(({data}) => data);
}
