export interface Game {
    id: string;
    owner: {
        id: string;
        name: string;
    };
    slotsCount: number;
    playersCount: number;
}
