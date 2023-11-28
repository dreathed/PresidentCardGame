import { IPlayer } from "./Players/IPlayer"

export interface ICardGame {
    addPlayer(Player: IPlayer): Promise<boolean>;
    removePlayer(Player: IPlayer): Promise<boolean>;
    dealCards(): void;
    run(): Promise<string>;
}

