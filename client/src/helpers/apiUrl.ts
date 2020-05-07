const isProd = process.env.NODE_ENV === "production";
const prodHost = process.env.REACT_APP_PROD_HOST;
export const apiUrl = (path: string) =>
  isProd ? `${prodHost}/api${path}` : `/api${path}`;
