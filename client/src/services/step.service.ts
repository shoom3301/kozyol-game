import axios from 'axios';
import { GameState } from 'model/GameState';
import { authService } from 'services/auth.service';
import { Cards } from 'model/Card';
import { apiUrl } from 'helpers/apiUrl';

export class StepService {
  doStep(gameId: number, cards: Cards): Promise<any> {
    return axios.post<GameState>(apiUrl(`/step/${gameId}`), {cards}, {...authService.withAuth()})
      .then(res => res.data)
  }
}

export const stepService = new StepService()
