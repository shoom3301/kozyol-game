import { IState } from 'store/states';
import { GameStateHelpers } from 'helpers/gameStateHelpers';

export const getGameState = ({ gameState }: IState): GameStateHelpers => gameState;
