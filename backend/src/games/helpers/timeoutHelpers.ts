import { SchedulerRegistry } from '@nestjs/schedule';

export const getTimeoutNameForGame = (gameId: number) => `game-${gameId}-ConfirmationTimeout`;

export const deleteTimeoutForGame = (gameId: number, schedulerRegistry: SchedulerRegistry) => {
  try {
    const timeout = schedulerRegistry.getTimeout(getTimeoutNameForGame(gameId));
    if (timeout) {
      clearTimeout(timeout);
      schedulerRegistry.deleteTimeout(getTimeoutNameForGame(gameId));
    }
  } catch (error) {}
};
