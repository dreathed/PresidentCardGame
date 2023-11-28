import { StandardCard } from "../Cards/StandardCard";

export enum PresidentCommand {
    PLAY = "playCards",
    PASS = "PASS",
    SEND = "SEND"
}

export enum GameCommand {
    LEAVE = "LEAVE",
    JOIN = "JOIN",
    CREATE = "CREATE"
}

export class GameAction {
    command: GameCommand;
    data: {tablename?: string}

    constructor(command: GameCommand, data: {}){
        this.command = command;
        this.data = data;
    }
}

export class PresidentAction {
    command: PresidentCommand;
    data: {cards: Array<StandardCard>};
    public constructor(command: PresidentCommand, data: {cards: Array<StandardCard>}){
        if((command === PresidentCommand.PLAY || command === PresidentCommand.SEND) && data.cards.length === 0){
            throw new Error("If command is PLAY or SEND data.cards must contain cards!");
        }

        if(command === PresidentCommand.PASS && data.cards.length !== 0){
            throw new Error("If command is PASS data.cards can not contain cards!");
        }

        this.command = command;
        this.data = data;
    }
}