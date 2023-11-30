import { IPlayer } from "./IPlayer";
import {  GameAction, PresidentAction, PresidentCommand } from "../Actions/Action";
import { CardSubList, Standard52CardDeck, StandardCard, Card } from "../Cards/StandardCard";

export class PresidentPlayer implements IPlayer {
    socket: {playerName:String, addEventListener(eventname: string, callback:(msg: PresidentAction | GameAction | MessageEvent | any) => void), send(data: string),removeEventListener(event: String, callback:(evt)=>void)};
    name: string;
    hand: CardSubList;
    GameEventReciever: EventTarget;

    constructor(socket, deck: Standard52CardDeck, GameEventReviever: EventTarget){
        this.socket = socket;
        this.hand = new CardSubList(deck, []);
        this.name = socket.playerName;
        this.socket.addEventListener("message", (msg) => {
            try{
                let msgObj = JSON.parse(msg);
                if(!msgObj.hasOwnProperty("data")){
                    return;
                }
                if(!msgObj.hasOwnProperty("command")){
                    return;
                }
                if(msgObj.command == "changeName"){
                    this.name = String(msgObj.data);
                    this.socket.send(JSON.stringify({state: {success: "Player name changed to: "+ this.name}}))
                }
            }catch(e){
                console.log(e);
            }
        })

        this.getAction = this.getAction.bind(this);
    }

    resetHand() {
        this.hand.reset();
    }

    getHand() {
        // because the interface is still not quite right...
        let returnValue = [];
        this.hand.cardArray.sort((a, b) => {
            if(a["value"] == b["value"]){
                return a["suit"] - b["suit"]
            }else{
                return a["value"] - b["value"]
            }
        })
        for(let card of this.hand.cardArray){
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
            returnValue.push(newCard)
        }
        return returnValue;
    }
    

    async removeCardFromHand(card: Card): Promise<boolean>{
        return this.hand.removeCard(card);
    }

    public getAction(): Promise<PresidentAction>{
        return new Promise((resolve, reject) => {
            let socket = this.socket;
            this.socket.addEventListener("message", function ActionHandler(evt: {data}){
                let msgObj = JSON.parse(evt.data);
                if(msgObj["command"] == "playCards"){
                    if(msgObj["data"].length == 0){
                        msgObj["command"] = PresidentCommand.PASS;
                        resolve(msgObj);
                        socket.removeEventListener("message", ActionHandler);
                        return
                    }
                    let newData = [];
                    for(let card of msgObj["data"]){
                        let newCard = StandardCard.fromStringArray(card)
                        if(newCard !== false){
                            newData.push(newCard);
                        }else{
                            throw new Error("card " +String(card) +" could not be created...");
                        }
                    }
                    msgObj.data.cards = newData;
                }

                if(msgObj["command"] == PresidentCommand.SEND){
                    let newData = [];
                    for(let card of msgObj["data"]){
                        let newCard = StandardCard.fromStringArray(card)
                        if(newCard !== false){
                            newData.push(newCard);
                        }else{
                            throw new Error("card " +String(card) +" could not be created...");
                        }
                    }
                    msgObj.data.cards = newData;
                }
                resolve(msgObj);
                socket.removeEventListener("message", ActionHandler);
            })
        });
    }

    public setName(name:string): void {
        this.name = name;
        this.socket.send(JSON.stringify({msg: "changed Name"}))
    }

    public async addCardToHand(card: Card){
        return this.hand.addCard(card);
    }

    public hasCards(): boolean {
        return this.hand.cardArray.length !== 0;
    }

    public hasCard(card: Card): boolean{
        return this.hand.cardInList(card)
    }

    public leaveTable(): Promise<PresidentAction> {
        return new Promise((resolve) => {
            
        })
    }
}