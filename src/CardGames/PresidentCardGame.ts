import { PresidentPlayer } from "./Players/PresidentPlayer";
import { CardValue, Standard52CardDeck, StandardCard } from "./Cards/StandardCard";
import { PresidentAction, PresidentCommand, GameCommand } from "./Actions/Action";
import { ICardGame } from "./ICardGame";

export class PresidentCardGame implements ICardGame {
    players: Array<PresidentPlayer>;
    deck: Standard52CardDeck
    tableValue: StandardCard[];
    playerActions: PresidentCommand[];
    turnIndex: number;
    phase: string;
    trash: number;
    president: number;
    vicePresident: number;
    viceTrash: number;
    targetNumberOfPlayers: number;
    tableName: string;
    eventReciever: EventTarget;

    constructor(targetNumberOfPlayers: number, tableName: string){
        this.players = [];
        this.deck = new Standard52CardDeck();
        this.tableValue = [];
        this.playerActions = [];
        this.turnIndex = 0;
        this.phase = "round";
        this.trash = null;
        this.president = null;
        this.vicePresident = null;
        this.viceTrash = null;
        this.targetNumberOfPlayers = targetNumberOfPlayers;
        this.tableName = tableName;
        this.eventReciever = new EventTarget();

        this.roundLogic = this.roundLogic.bind(this);
        this.exchangePhase = this.exchangePhase.bind(this);
        this.runRound = this.runRound.bind(this);
        this.runGame = this.runGame.bind(this);
    }

    public addPlayer(Player: PresidentPlayer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(!(Player instanceof PresidentPlayer)){
                reject(false)
            }else{
                this.players.push(Player);
                let game = this;
                Player.socket.addEventListener("message", function (evt: {data: any}): void {
                        if(evt.data.command === GameCommand.LEAVE) {
                            let event = new MessageEvent("message", {data: {msg: "no players left"}})
                            game.eventReciever.dispatchEvent(event)
                            game.removePlayer(Player);
                        }
                    })
                this.playerActions.push(null);
                resolve(true);
            }
        })
    }

    public removePlayer(Player: PresidentPlayer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.players.find((player) => Object.is(Player, player)) === undefined){
                reject(false)
            }else{
                let index = this.players.indexOf(Player);
                this.playerActions.splice(index, 1);
                this.players = this.players.filter((player) => !Object.is(Player, player));
                resolve(true);
            }
        })
    }

    hasPlayers(): Promise<boolean> {
        return new Promise((resolve) => {
            if(this.players.length > 0){
                resolve(true);
            }else{
                resolve(false);
            }
        })
    }

    public async dealCards() {
        for(let player of this.players){
            player.resetHand();
        }
        await this.deck.resetDeck();
        let length = this.deck.cardArray.length
        for(let i=0; i<length; i++){
            let card = await this.deck.getRandomCard();
            await this.players[i % this.players.length].addCardToHand(card);
            await this.deck.removeCard(card);
        }
        this.broadcastState();
    }

    public onlyAcesOnTable(): boolean {
        if(this.tableValue.every((card) => card.getValue() === CardValue.ACE)){
            return true;
        }
        return false;
    }

    public NoCardsOnTable(): boolean {
        if(this.tableValue.length === 0){
            return true;
        }
        return false;
    }

    public AllEligiblePlayersPassed(): boolean {
        for(let i=0; i<this.players.length; i++){
            if(i === this.turnIndex){
                continue;
            }
            if(this.playerActions[i] !== PresidentCommand.PASS){
                return false;
            }
        }
        return true;
    }

    public onlyOnePlayerHasCards(): boolean {
        let count = 0;
        for(let i=0; i<this.players.length; i++){
            if(this.players[i].hasCards()){
                count += 1;
            }
        }
        if(count === 1){
            return true;
        }
        return false;
    }

    private convertToOldCardType(card){
        let newCard = [];
        if(card["value"] < 10){
            newCard.push(String(card["value"]));
        }else if(card["value"] == 10){
            newCard.push("10");
        }else if(card["value"] == 11){
            newCard.push("J");
        }else if(card["value"] == 12){
            newCard.push("Q");
        }else if(card["value"] == 13){
            newCard.push("K");
        }else if(card["value"] == 14){
            newCard.push("A");
        }
        if(card["suit"] == 1){
            newCard.push("D")
        }else if(card["suit"] == 2){
            newCard.push("H")
        }else if(card["suit"] == 3){
            newCard.push("S")
        }else if(card["suit"] == 4){
            newCard.push("C")
        }
        return newCard;
    }

    public broadcastState(): Promise<boolean> {
        return new Promise((resolve) => {
            let state = {
                name: this.tableName,
                playerNames: this.players.map((player) => player["name"]),
                players: this.players.map((player, idx) => idx),
                tableValue: this.tableValue.map((card) => this.convertToOldCardType(card)),
                president: this.president,
                vicePresident: this.vicePresident,
                trash: this.trash,
                viceTrash: this.viceTrash,
                turn: this.turnIndex,
                targetNumberOfPlayers: this.targetNumberOfPlayers,
                phase: this.phase,
                AllEligiblePlayersPassed: this.AllEligiblePlayersPassed()
            }
            
            for(let i=0; i<this.players.length; i++){
                state["id"] = i;
                console.log(JSON.stringify({state:{msg: "game started", cards: this.players[i].getHand(), table: state}}))
                this.players[i].socket.send(JSON.stringify({state:{msg: "game started", cards: this.players[i].getHand(), table: state}}))
            }
            resolve(true)
        })
    }

    public GameMoveOK(Player: PresidentPlayer,Action: PresidentAction): boolean {

        if(Action.command === PresidentCommand.PLAY){
            if(Action.data.cards.length === 0){
                return false;
            }

            let cardValue = Action.data.cards[0].getValue()
            if(!Action.data.cards.every((card) => card.getValue() === cardValue)){
                return false;
            }

            if(!Action.data.cards.every((card) => Player.hasCard(card))){
                return false;
            }

            if(this.AllEligiblePlayersPassed()){
                return true;
            }

            if(this.tableValue.length > 0 && this.tableValue[0].getValue() !== CardValue.ACE){
                if(this.tableValue[0].getValue() >= cardValue){
                    return false;
                }
                if(Action.data.cards.length != this.tableValue.length){
                    return false;
                }
            }
        }

        if(Action.command === PresidentCommand.SEND){
            console.log(Action.data)
            if(Action.data.cards.length === 0){
                return false;
            }

            if(!Action.data.cards.every((card) => Player.hasCard(card))){
                return false;
            }
        }
        return true
    }

    determineRoles(Player: PresidentPlayer){
        if(!Player.hasCards()){
            let NoOfPlayersWithCards = this.players.filter((player) => player.hasCards()).length
            if(this.president === null){
                this.president = this.players.indexOf(Player);
            } else if(NoOfPlayersWithCards >= 2 && this.vicePresident === null){
                this.vicePresident = this.players.indexOf(Player);
            }
            if(this.vicePresident !== null && NoOfPlayersWithCards === 1){
                this.viceTrash = this.players.indexOf(Player);
                let trashPlayer = this.players.filter((player) => player.hasCards())[0]
                this.trash = this.players.indexOf(trashPlayer);
                this.phase = "exchange";
            }
            if(this.vicePresident === null && NoOfPlayersWithCards === 1){
                let trashPlayer = this.players.filter((player) => player.hasCards())[0]
                this.trash = this.players.indexOf(trashPlayer);
                this.phase = "exchange";
            }
        }
    }

    roundLogic(): Promise<boolean> {
        return new Promise(async (res) => {
            if(!this.players[this.turnIndex].hasCards()){
                this.playerActions[this.turnIndex] = PresidentCommand.PASS;
                this.turnIndex = (this.turnIndex + 1) % this.players.length;
                await this.broadcastState()
                res(false);
                return;
            }

            let action = await this.players[this.turnIndex].getAction();

            if(!this.GameMoveOK(this.players[this.turnIndex], action)){
                this.players[this.turnIndex].socket.send(JSON.stringify({error: "Action could not be processed!"}))
                res(false);
                return;
            }

            this.playerActions[this.turnIndex] = action.command;
            if(action.command === PresidentCommand.PASS){
                this.turnIndex = (this.turnIndex + 1) % this.players.length;
                this.playerActions[this.turnIndex] = PresidentCommand.PASS;
                await this.broadcastState()
                res(true);
                return;
            }

            if((this.onlyAcesOnTable() ||
                this.NoCardsOnTable() ||
                this.AllEligiblePlayersPassed()) &&
                action.command === PresidentCommand.PLAY){
                    this.tableValue = action.data.cards;
                    for(let card of action.data.cards){
                        await this.players[this.turnIndex].removeCardFromHand(card)
                    }
                    this.determineRoles(this.players[this.turnIndex])
            }else if(action.command === PresidentCommand.PLAY &&
                action.data.cards[0].getValue() > this.tableValue[0].getValue()){
                this.tableValue = action.data.cards;
                for(let card of action.data.cards){
                    await this.players[this.turnIndex].removeCardFromHand(card)
                }
                this.determineRoles(this.players[this.turnIndex])
            }else {
                this.players[this.turnIndex].socket.send(JSON.stringify({error: "Action could not be processed!"}))
                res(false);
                return;
            }

            if(this.onlyOnePlayerHasCards()){
                res(true);
                return;
            }

            if(this.onlyAcesOnTable()){
                await this.broadcastState()
                res(true);
                return;
            }

            this.turnIndex = (this.turnIndex + 1) % this.players.length;
            await this.broadcastState()
            res(true);
            return;
        })
    }

    exchangePhase():Promise<boolean>{
        return new Promise(async (res) => {
            let p1;
            let p2;
            if(this.vicePresident !== null){
                p1 = this.ExchangeCards(this.vicePresident, this.viceTrash, 1)
            }
            if(this.president !== null){
                p2 = this.ExchangeCards(this.president, this.trash, 2);
            }
    
            if(p1 && p2){
                await Promise.all([p1, p2]);
                
            }else{
                // it should not be possiblie for p1 to be defined while p2 is undefined: By game logic!
                await p2
            }
            res(true);
        })
    }

    async runPlayPhase():Promise<boolean>{
        let game = this;
        return new Promise(async (res) => {
            await game.roundLogic();
            if(game.onlyOnePlayerHasCards()){
                res(true);
            }else{
                let result = await game.runPlayPhase();
                res(result);
            }
        })
    }

    async runRound():Promise<boolean> {
        let game = this
        return new Promise(async (res) => {
            await game.dealCards();
            this.tableValue = [];
            await game.exchangePhase();
            if(this.president !== null){
                this.turnIndex = this.president;
            }else{
                this.turnIndex = 0;
            }
            this.president = null;
            this.vicePresident = null;
            this.viceTrash = null;
            this.trash = null;
            this.tableValue = [];
            this.phase = "round";
            await this.broadcastState();
            await game.runPlayPhase();
            if(game.onlyOnePlayerHasCards()){
                res(true)
                return;
            }
            await game.runRound();
        })
    }

    async ExchangeCards(fromIndex, toIndex, numberOfCards:number):Promise<boolean>{
        return new Promise(async (resolve) => {
            try {
                let action = await this.players[fromIndex].getAction();
                if(action.command === PresidentCommand.SEND && action.data.cards.length == numberOfCards){
                    this.players[toIndex].hand.cardArray.sort((a,b) => {
                        if(a["value"] == b["value"]){
                            return a["suit"] - b["suit"]
                        }else{
                            return a["value"] - b["value"]
                        }
                    })
                    let cardsFrom = this.players[toIndex].hand.cardArray.slice(this.players[toIndex].hand.cardArray.length-numberOfCards)
                    for(let card of cardsFrom){
                        this.players[toIndex].removeCardFromHand(card);
                        this.players[fromIndex].addCardToHand(card);
                    }
                    for(let card of action.data.cards){
                        this.players[fromIndex].removeCardFromHand(card);
                        this.players[toIndex].addCardToHand(card);
                    }
                    resolve(true);
                }
            }catch(e) {
                console.log(e)
                resolve(false);
            }
        })   
    }

    public runGame(): Promise<string> {
        let game = this;
        return new Promise(async (resolve) => {
            game.eventReciever.addEventListener("message",  function (evt: MessageEvent): void {
                    if (evt.data.msg === "no players left") {
                        console.log("no players left")
                        resolve("no players left");
                    }
                })
            while(true){
                let result = await game.runRound()
            }
            //let result = await game.runRound()
            //resolve("ended game");
        })
    }

    run(): Promise<string> {
        return new Promise((res) => {
            res("This is complete.")
        })
    }

}