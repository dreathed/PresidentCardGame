import { PresidentAction } from "../Actions/Action";
import { Card } from "../Cards/StandardCard";

export interface IPlayer {
    getAction(): Promise<PresidentAction>;
    hasCards(): boolean;
}

