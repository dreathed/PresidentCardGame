function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export enum CardValue {
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = 11,
    QUEEN = 12,
    KING = 13,
    ACE = 14
}

export enum CardSuit {
    DIAMOND = 1,
    HEARTS = 2,
    SPADES = 3,
    CLUBS = 4
}

export interface Card {
    /*
        this methodd should return a value, that is
        easily comparable, to represent the type of the card
        (as opposed to tokens)
    */
    getType(): any;
}

interface ValuedCard extends Card{
    getValue(): CardValue;
}

interface SuitedCard extends Card{
    getSuit(): CardSuit;
}

interface ICardSuperList {
    isCard(card: Card): boolean;
}

class SuperList implements ICardSuperList {
    cardArray: Array<Card>
    constructor(cards: Array<Card>){
        this.cardArray = cards;
    }
    
    isCard(card: Card): boolean {
        if(this.cardArray.find((card2) => card2.getType() === card.getType())){
            return true;
        }
        return false;
    }
}

export class CardSubList {
    superList: ICardSuperList;
    cardArray: Array<Card>

    constructor(superList: SuperList, cards: Array<Card> = []){
        this.superList = superList;
        this.cardArray = cards;
    }

    public addCard(card: Card): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.isCard(card) && !this.cardInList(card)){
                this.cardArray.push(card);
                resolve(true)
            }else{
                reject(false)
            }
        })
    };

    public reset(){
        this.cardArray = [];
    }

    public removeCard(card: Card): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if(this.cardInList(card)){
                this.cardArray = this.cardArray.filter((card1) => card1.getType() !== card.getType());
                resolve(true);
            }else {
                reject(false);
            }
        })
    };

    public getRandomCard(): Promise<Card> {
        return new Promise((resolve, reject) => {
            let idx = Math.floor(Math.random() * this.cardArray.length);
            resolve(this.cardArray[idx])
        })
    };

    public cardInList(card: Card): boolean {
        if(this.cardArray.find((card1) => card1.getType() === card.getType())){
            return true;
        }
        return false;
    };

    public isCard(card: Card){
        return this.superList.isCard(card);
    }
}

export class Standard52CardDeck extends CardSubList {
    superList: ICardSuperList;
    public cardArray: Array<StandardCard>

    public constructor(){
        // make complete deck:
        super(new SuperList([]), []);
        this.cardArray = []
        for(let value of enumKeys(CardValue)){
            for(let suit of enumKeys(CardSuit)){
                let newCard = new StandardCard(CardValue[value], CardSuit[suit])
                this.cardArray.push(newCard);
            }
        }
        this.superList = new SuperList(this.cardArray);
    }

    public resetDeck(): Promise<boolean> {
        return new Promise((resolve) => {
            this.cardArray = []
            for(let value of enumKeys(CardValue)){
                for(let suit of enumKeys(CardSuit)){
                    let newCard = new StandardCard(CardValue[value], CardSuit[suit])
                    this.cardArray.push(newCard);
                }
            }
            resolve(true)
        })
    }

    public getRandomCard(): Promise<StandardCard> {
        return new Promise((resolve, reject) => {
            let idx = Math.floor(Math.random() * this.cardArray.length);
            resolve(this.cardArray[idx])
        })
    };

    public AllCardsSameValue(): boolean {
        if(this.cardArray.length === 0){
            return true;
        }

        let firstValue = this.cardArray[0].getValue();
        for(let card of this.cardArray){
            if(card.getValue() !== firstValue){
                return false
            }
        }
        return true;
    }
}

export class StandardCard implements ValuedCard, SuitedCard {
    value: CardValue;
    suit: CardSuit;

    constructor(value: CardValue, suit: CardSuit){
        this.value = value;
        this.suit = suit;
    }

    public static fromStringArray(array: Array<String>): StandardCard|boolean{
        if(array.length != 2){
            return false;
        }
        let value:CardValue|boolean = false;
        let suit:CardSuit|boolean = false;
        switch(array[0]){
            case "2": {
                value = CardValue.TWO;
                break;
            }
                
            case "3": {
                value = CardValue.THREE;
                break;
            }
                
            case "4": {
                value = CardValue.FOUR;
                break;
            }
                
            case "5": {
                value = CardValue.FIVE;
                break;
            }
                
            case "6": {
                value = CardValue.SIX;
                break;
            }
                
            case "7": {
                value = CardValue.SEVEN;
                break;
            }
                
            case "8": {
                value = CardValue.EIGHT;
                break;
            }
                
            case "9": {
                value = CardValue.NINE;
                break;
            }
                
            case "10": {
                value = CardValue.TEN;
                break;
            }
                
            case "J": {
                value = CardValue.JACK;
                break;
            }
                
            case "Q": {
                value = CardValue.QUEEN;
                break;
            }
                
            case "K": {
                value = CardValue.KING;
                break;
            }
                
            case "A": {
                value = CardValue.ACE;
                break;
            }
                
        }
        switch(array[1]){
            case "D": {
                suit = CardSuit.DIAMOND;
                break;
            }
                
            case "H": {
                suit = CardSuit.HEARTS;
                break;
            }
                
            case "S": {
                suit = CardSuit.SPADES;
                break;
            }
                
            case "C": {
                suit = CardSuit.CLUBS;
                break;
            }
                
        }
        if(suit !== false && value !== false){
            return new StandardCard(value, suit);
        }
        return false;
    }

    getValue(): CardValue {
        return this.value;
    }

    getSuit(): CardSuit {
        return this.suit
    }

    getType() {
        return String(this.value) + "," + String(this.suit);
    }
}


