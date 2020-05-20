import { AwaitedConfirmation } from '../entities/awaitedConfirmation';

export const createAwaitedConfirmation = async (gameId: number, userId: number) => {
  await AwaitedConfirmation.save({
    game: { id: gameId },
    player: { id: userId },
  } as AwaitedConfirmation);
  return;
};

export const confirmContinue = async (gameId: number, userId: number) => {
  await AwaitedConfirmation.delete({ game: { id: gameId }, player: { id: userId } });
  return;
};

export const confirmContinueForAll = async (gameId: number) => {
  await AwaitedConfirmation.delete({ game: { id: gameId } });
  return;
};

export const isGameNeedConfirmationsForContinue = async (gameId: number) => {
  const awaitedConfirms = await AwaitedConfirmation.find({ where: { game: { id: gameId } } });
  return awaitedConfirms.length > 0;
};
