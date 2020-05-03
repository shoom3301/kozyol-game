import axios from 'axios';
import {authService} from 'services/auth.service';

export class GamesService {
    getList(): Promise<string[]> {
        return axios.get<string[]>('/api/games/list',{...authService.withAuth()})
            .then(res => res.data)
    }
}

export const gamesService = new GamesService()
