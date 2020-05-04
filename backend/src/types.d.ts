declare global {
  namespace Express {
    interface User {
      userId: number;
      username: string;
    }
  }
}

export {};
