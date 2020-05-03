export const mainRoute = '/';
export const authorizationRoute = '/authorization';
export const registrationRoute = '/registration';
export const quoteIdParam = 'quoteId';
export const quotePageRoute = (quoteId: string | number = `:${quoteIdParam}`): string => `/quote/${quoteId}`;
