export const mainRoute = '/';
export const authorizationRoute = '/authorization';
export const registrationRoute = '/registration';
export const gameRoute = (gameId: string = ':gameId') => `/game/${gameId}`;
