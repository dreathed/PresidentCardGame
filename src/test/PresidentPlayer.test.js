import { PresidentPlayer } from "../CardGames/Players/PresidentPlayer";
import { CardSuit, CardValue, Standard52CardDeck, StandardCard } from "../CardGames/Cards/StandardCard";
import { PresidentAction, PresidentCommand } from "../CardGames/Actions/Action";

class TestEventTarget extends EventTarget {
    /**
     * used for sockets "on"-method
     */

    constructor(){
        super();
    }

    on(string, callback){
        this.addEventListener(string, callback);
    }
}

describe("PresidentPlayer tests", () => {
    describe("addCardToHand tests", () => {
        test("should add a card if it is a valid 52 Deck card", async () => {
            
        })

        test("PresidentCommand.PASS should work!", async () => {
            let gameDeck = new Standard52CardDeck();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, gameDeck);
            let MyAction = new PresidentAction(PresidentCommand.PASS, {cards: []})
            let MyEvent = new MessageEvent("message", {data: MyAction})
            setTimeout(()=>{player.socket.dispatchEvent(MyEvent)}, 100)
            let action = await player.getAction()
            expect(action).toHaveProperty("command", PresidentCommand.PASS);
        })

        test("PresidentCommand.PLAY should work!", async () => {
            let gameDeck = new Standard52CardDeck();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, gameDeck);
            let MyAction = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.NINE, CardSuit.HEARTS), 
                    new StandardCard(CardValue.NINE, CardSuit.CLUBS)
                ]
            })
            let MyEvent = new MessageEvent("message", {data: MyAction})
            setTimeout(()=>{player.socket.dispatchEvent(MyEvent)}, 100)
            let action = await player.getAction()
            expect(action).toHaveProperty("command", PresidentCommand.PLAY, {data: MyAction});
        })

        test("PresidentCommand.SEND should work!", async () => {
            let gameDeck = new Standard52CardDeck();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, gameDeck);
            let MyAction = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.NINE, CardSuit.HEARTS), 
                    new StandardCard(CardValue.NINE, CardSuit.CLUBS)
                ]
            })
            let MyEvent = new MessageEvent("message", {data: MyAction})
            setTimeout(()=>{player.socket.dispatchEvent(MyEvent)}, 100)
            let action = await player.getAction()
            expect(action).toHaveProperty("command", PresidentCommand.SEND, {data: MyAction});
        })

        test("after adding a card, it should be in a players hand", () => {
            let gameDeck = new Standard52CardDeck();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, gameDeck);
            player.addCardToHand(new StandardCard(CardValue.NINE, CardSuit.HEARTS))
            expect(player.hand.cardInList(new StandardCard(CardValue.NINE, CardSuit.HEARTS))).toBe(true);
        })

        test("hasCards should return true for a card, after card has been added.", () => {
            let gameDeck = new Standard52CardDeck();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, gameDeck);
            player.addCardToHand(new StandardCard(CardValue.NINE, CardSuit.HEARTS))
            expect(player.hasCards()).toBe(true);
        })
    })
})