const helpers = require("../../helpers")

class ICardList {
    constructor(){
        if(this.constructor == ICardList){
            throw new Error("Abstract classes cannot be instanciated!");
        }
    }

    removeCard(card){
        throw new Error("Method removeCard must be implemented!");
    }

    cardIsInList(card){
        throw new Error("Method cardInList must be implemented!");
    }

    getRandomCard(){
        throw new Error("Method getRandomCard must be implemented!");
    }

    getAllCards(){
        throw new Error("Method getAllCards must be implemented!");
    }
}


class ICardDeck extends ICardList {
    constructor(){
        super();
        if(this.constructor == ICardDeck){
            throw new Error("Abstract classes cannot be instanciated!");
        }
    }

    isCard(testObj){
        throw new Error("Method isCard must be implemented!");
    }

    getAllCards(){
        throw new Error("Method getAllCardsAsArray must be implemented!");
    }

    valueHigherThan(a, b){
        throw new Error("Method ValueHigherThan must be implemented!");
    }
}


class Standard52PlayerHand extends ICardList {
    constructor(cards, Deck){
        super();
        if(!cards instanceof Array || !Deck instanceof ICardDeck){
            throw Error("Cards must be an array and Deck must be an Instance of ICardDeck");
        }
        this.cards = [...cards];

        this.Deck = Deck
    }
    
    removeCard(card){
        if(this.cardIsInList(card)){
            this.cards.splice(this.cards.indexOf(card), 1)
        }
    }

    valueHigherThan(a, b){
        return this.Deck.valueHigherThan(a, b);
    }

    cardIsInList(card){
        if(typeof card !== "string"){
            return false;
        }
        if(this.cards.includes(card)){
            return true;
        }else{
            return false;
        }
    }
}


class Standard52Deck extends ICardDeck {
    static values = ["2" ,"3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    static colors = ["D", "H", "S", "C"];

    constructor(){
        super();
        this.cards = this.makeCards();

        this.valueHigherThan = this.valueHigherThan.bind(this);
    }

    makeCards(){
        let cards = []
        for(let value of Standard52Deck.values){
            for(let color of Standard52Deck.colors){
                cards.push(value+color);
            }
        }
        return cards;
    }

    isCard(testObj){  
        if(typeof testObj !== "string"){
            return false;
        }

        let cards = this.makeCards();
        if(cards.includes(testObj)){
            return true;
        }else{
            return false;
        }
    }

    removeCard(card){
        if(this.cardIsInList(card)){
            this.cards.splice(this.cards.indexOf(card), 1)
        }
    }

    removeRandomCard(){
        let card = helpers.choice(this.cards);
        this.removeCard(card)
        return card;
    }

    cardIsInList(testObj){
        if(typeof testObj !== "string"){
            return false;
        }
        if(this.cards.includes(testObj)){
            return true;
        }else{
            return false;
        }
    }

    valueHigherThan(card1, card2){  
        if(this.isCard(card1) && this.isCard(card2)){
            return Standard52Deck.values.indexOf(card1[0]) > Standard52Deck.values.indexOf(card2[0]);
        }else{
            throw new TypeError("Both arguments for valueHigherThan must be cards.")
        }
    }

    getAllCardsAsArray(){
        let cards = [];
        for(let value of Standard52Deck.values){
            for(let color of Standard52Deck.colors){
                cards.push(value+color);
            }
        }
        return cards;
    }
}

module.exports.Standard52Deck = Standard52Deck;