import { PresidentCardGame } from "../CardGames/PresidentCardGame";
import { PresidentPlayer } from "../CardGames/Players/PresidentPlayer";
import { CardSubList, CardSuit, CardValue, StandardCard } from "../CardGames/Cards/StandardCard";
import { GameAction, GameCommand, PresidentAction, PresidentCommand } from "../CardGames/Actions/Action";

class TestEventTarget extends EventTarget {
    /**
     * used for sockets "on"-method
     */

    constructor(){
        super();
        this.messageTexts = [];
    }

    on(string, callback){
        this.addEventListener(string, callback);
    }

    send(string){
        this.messageTexts.push(string)
    }
}

describe("PresidentCardGame test", () => {
    describe("addPlayer tests", () => {
        test("after adding a player the player should be in the list of players", async () => {
            let game = new PresidentCardGame();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, game.deck);
            await game.addPlayer(player);
            expect(game.players).toContainEqual(player);
        })

        test("after adding a player and removing again, there should not be the player in the players array", async () => {
            let game = new PresidentCardGame();
            let s = new TestEventTarget();
            let player = new PresidentPlayer(s, game.deck);
            await game.addPlayer(player);
            await game.removePlayer(player)
            expect(game.players).not.toContainEqual(player);
        })
    })

    describe("dealCards tests", () => {
        test("after dealing cards, every Player should have cards", async () => {
            let game = new PresidentCardGame();
            let s = new TestEventTarget();
            let s2 = new TestEventTarget();
            let player = new PresidentPlayer(s, game.deck);
            let player2 = new PresidentPlayer(s2, game.deck);
            await game.addPlayer(player);
            await game.addPlayer(player2);
            await game.dealCards();
            expect(game.players.every((p) => {return p.hasCards()})).toBe(true);
        })

        test("after dealing cards, every Player should have different cards", async () => {
            let game = new PresidentCardGame();
            let s = new TestEventTarget();
            let s2 = new TestEventTarget();
            let s3 = new TestEventTarget();
            let player = new PresidentPlayer(s, game.deck);
            let player2 = new PresidentPlayer(s2, game.deck);
            let player3 = new PresidentPlayer(s3, game.deck);

            await game.addPlayer(player);
            await game.addPlayer(player2);
            await game.addPlayer(player3);

            await game.dealCards();

            let cards1 = player.hand;
            let cards2 = player2.hand;
            let cards3 = player3.hand;

            let bool1 = cards1.cardArray.every((card) => {return (!cards2.cardInList(card) && !cards3.cardInList(card))})
            let bool2 = cards2.cardArray.every((card) => {return (!cards1.cardInList(card) && !cards3.cardInList(card))})
            let bool3 = cards3.cardArray.every((card) => {return (!cards1.cardInList(card) && !cards2.cardInList(card))})
            expect(bool1 && bool2 && bool3).toBe(true);
        })

        test("after dealing cards, the deck should be empty!", async () => {
            let game = new PresidentCardGame();
            let s = new TestEventTarget();
            let s2 = new TestEventTarget();
            let s3 = new TestEventTarget();
            let player = new PresidentPlayer(s, game.deck);
            let player2 = new PresidentPlayer(s2, game.deck);
            let player3 = new PresidentPlayer(s3, game.deck);

            await game.addPlayer(player);
            await game.addPlayer(player2);
            await game.addPlayer(player3);

            await game.dealCards();

            expect(game.deck.cardArray.length).toBe(0);
        })
    })

    describe("onlyAcesOnTable", () => {
        test("onlyAcesOnTable should return true for empty table", async () => {
            let game = new PresidentCardGame();
            expect(game.onlyAcesOnTable()).toBe(true)
        })

        test("onlyAcesOnTable should return true for one ace on table", async () => {
            let game = new PresidentCardGame();
            game.tableValue = [new StandardCard(CardValue.ACE, CardSuit.DIAMOND)]
            expect(game.onlyAcesOnTable()).toBe(true)
        })

        test("onlyAcesOnTable should return true for three ace on table", async () => {
            let game = new PresidentCardGame();
            game.tableValue = [new StandardCard(CardValue.ACE, CardSuit.DIAMOND), new StandardCard(CardValue.ACE, CardSuit.HEARTS), new StandardCard(CardValue.ACE, CardSuit.CLUBS)]
            expect(game.onlyAcesOnTable()).toBe(true)
        })

        test("onlyAcesOnTable should return false for some other cards on table", async () => {
            let game = new PresidentCardGame();
            game.tableValue = [new StandardCard(CardValue.EIGHT, CardSuit.DIAMOND), new StandardCard(CardValue.EIGHT, CardSuit.HEARTS), new StandardCard(CardValue.EIGHT, CardSuit.CLUBS)]
            expect(game.onlyAcesOnTable()).toBe(false)
        })

        test("onlyAcesOnTable should return false for some other cards on table, but one ace is there (not allowed for other reasons...)", async () => {
            let game = new PresidentCardGame();
            game.tableValue = [new StandardCard(CardValue.EIGHT, CardSuit.DIAMOND), new StandardCard(CardValue.ACE, CardSuit.HEARTS)]
            expect(game.onlyAcesOnTable()).toBe(false)
        })
    })

    describe("NoCardsOnTable", () => {
        test("NoCardsOnTable should be true if there are no cards on the table", () => {
            let game = new PresidentCardGame();
            game.tableValue = []
            expect(game.NoCardsOnTable()).toBe(true)
        })

        test("NoCardsOnTable should be false if there are cards on the table", () => {
            let game = new PresidentCardGame();
            game.tableValue = [new StandardCard(CardValue.ACE, CardSuit.DIAMOND)]
            expect(game.NoCardsOnTable()).toBe(false)
        })
    })

    describe("run", () => {
        let game = new PresidentCardGame();
        let s = new TestEventTarget();
        let s2 = new TestEventTarget();
        let s3 = new TestEventTarget();
        let player = new PresidentPlayer(s, game.deck);
        let player2 = new PresidentPlayer(s2, game.deck);
        let player3 = new PresidentPlayer(s3, game.deck);

        // declare events for players to do their moves.
        let PlayJackOfHearts;
        let PlayAceOfHearts;
        let PlayThrees;
        let Pass_FirstEvent;
        let PlayEights;
        let PlayQueens;
        let Pass_SecondEvent;

        beforeEach(async () => {
            game = new PresidentCardGame();
            s = new TestEventTarget();
            s2 = new TestEventTarget();
            s3 = new TestEventTarget();
            player = new PresidentPlayer(s, game.deck);
            player2 = new PresidentPlayer(s2, game.deck);
            player3 = new PresidentPlayer(s3, game.deck);

            await game.addPlayer(player);
            await game.addPlayer(player2);
            await game.addPlayer(player3);

            let MockDealCards = async function() {
                await player.addCardToHand(new StandardCard(CardValue.EIGHT, CardSuit.CLUBS));
                await player.addCardToHand(new StandardCard(CardValue.EIGHT, CardSuit.DIAMOND));
                await player.addCardToHand(new StandardCard(CardValue.JACK, CardSuit.HEARTS));
                await player.addCardToHand(new StandardCard(CardValue.QUEEN, CardSuit.HEARTS));
                await player.addCardToHand(new StandardCard(CardValue.QUEEN, CardSuit.SPADES));

                await player2.addCardToHand(new StandardCard(CardValue.THREE, CardSuit.CLUBS));
                await player2.addCardToHand(new StandardCard(CardValue.THREE, CardSuit.DIAMOND));
                await player2.addCardToHand(new StandardCard(CardValue.ACE, CardSuit.HEARTS));

                await player3.addCardToHand(new StandardCard(CardValue.TWO, CardSuit.CLUBS));
                await player3.addCardToHand(new StandardCard(CardValue.ACE, CardSuit.DIAMOND));
            }
            game.dealCards = MockDealCards;

            // create the player moves:
            let playerAction1 = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.JACK, CardSuit.HEARTS)
                ]
            })
            PlayJackOfHearts = new MessageEvent("message", {data: playerAction1})

            let playerAction2 = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.ACE, CardSuit.HEARTS)
                ]
            })
            PlayAceOfHearts = new MessageEvent("message", {data: playerAction2})

            let playerAction22 = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.THREE, CardSuit.DIAMOND),
                    new StandardCard(CardValue.THREE, CardSuit.CLUBS)
                ]
            })
            PlayThrees = new MessageEvent("message", {data: playerAction22})

            let playerAction3 = new PresidentAction(PresidentCommand.PASS, {
                cards: [
                ]
            })
            Pass_FirstEvent = new MessageEvent("message", {data: playerAction3})

            let playerAction12 = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.EIGHT, CardSuit.CLUBS),
                    new StandardCard(CardValue.EIGHT, CardSuit.DIAMOND)
                ]
            })
            PlayEights = new MessageEvent("message", {data: playerAction12})

            let playerAction13 = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.QUEEN, CardSuit.HEARTS),
                    new StandardCard(CardValue.QUEEN, CardSuit.SPADES)
                ]
            })
            PlayQueens = new MessageEvent("message", {data: playerAction13})

            let secondPassAction = new PresidentAction(PresidentCommand.PASS, {
                cards: [
                ]
            })
            Pass_SecondEvent = new MessageEvent("message", {data: secondPassAction})
        })

        test("test run: the game should complete", async () => {
            setTimeout(() => {player.socket.dispatchEvent(PlayJackOfHearts)}, 100)
            setTimeout(() => {player2.socket.dispatchEvent(PlayAceOfHearts)}, 200)
            setTimeout(() => {player2.socket.dispatchEvent(PlayThrees)}, 300)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_FirstEvent)}, 400)
            setTimeout(() => {player.socket.dispatchEvent(PlayEights)}, 500)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_SecondEvent)}, 600)
            setTimeout(() => {player.socket.dispatchEvent(PlayQueens)}, 700)

            let LEAVEACTION = new GameAction(GameCommand.LEAVE, {});
            let LEAVEENVENT = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT1 = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT2 = new MessageEvent("message", {data: LEAVEACTION});

            //setTimeout(() => {player.socket.dispatchEvent(LEAVEENVENT)}, 800)
            //setTimeout(() => {player2.socket.dispatchEvent(LEAVEENVENT1)}, 800)
            //setTimeout(() => {player3.socket.dispatchEvent(LEAVEENVENT2)}, 800)

            let result = await game.runGame();
            expect(result).toBe("ended game")
        })

        test("test run: Actions should only be processed when it is the players turn.", async () => {

            let secondPassAction = new PresidentAction(PresidentCommand.PASS, {
                cards: [
                ]
            })
            let ThirdPassEvent = new MessageEvent("message", {data: secondPassAction})
            
            setTimeout(() => {player.socket.dispatchEvent(PlayJackOfHearts)}, 100)
            setTimeout(() => {player2.socket.dispatchEvent(PlayAceOfHearts)}, 200)
            setTimeout(() => {player2.socket.dispatchEvent(PlayThrees)}, 300)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_FirstEvent)}, 400)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_SecondEvent)}, 500)
            setTimeout(() => {player.socket.dispatchEvent(PlayEights)}, 600)
            setTimeout(() => {player3.socket.dispatchEvent(ThirdPassEvent)}, 700)
            setTimeout(() => {player.socket.dispatchEvent(PlayQueens)}, 800)

            let LEAVEACTION = new GameAction(GameCommand.LEAVE, {});
            let LEAVEENVENT = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT1 = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT2 = new MessageEvent("message", {data: LEAVEACTION});

            //setTimeout(() => {player.socket.dispatchEvent(LEAVEENVENT)}, 900)
            //setTimeout(() => {player2.socket.dispatchEvent(LEAVEENVENT1)}, 900)
            //setTimeout(() => {player3.socket.dispatchEvent(LEAVEENVENT2)}, 900)

            const getAction = jest.spyOn(player3, "getAction");

            await game.runGame();
            expect(getAction).toHaveBeenCalledTimes(2)
        })

        test("players should not be able to play cards they do not have", async () => {
            let WRONGPLAY = new PresidentAction(PresidentCommand.PLAY, {
                cards: [
                    new StandardCard(CardValue.SEVEN, CardSuit.CLUBS)
                ]
            })
            let PlayWrongCard = new MessageEvent("message", {data: WRONGPLAY})

            let LEAVEACTION = new GameAction(GameCommand.LEAVE, {});
            let LEAVEENVENT = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT1 = new MessageEvent("message", {data: LEAVEACTION});
            let LEAVEENVENT2 = new MessageEvent("message", {data: LEAVEACTION});
            
            setTimeout(() => {player.socket.dispatchEvent(PlayJackOfHearts)}, 100)
            setTimeout(() => {player2.socket.dispatchEvent(PlayAceOfHearts)}, 200)
            setTimeout(() => {player2.socket.dispatchEvent(PlayThrees)}, 300)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_FirstEvent)}, 400)
            setTimeout(() => {player.socket.dispatchEvent(PlayEights)}, 500)
            setTimeout(() => {player3.socket.dispatchEvent(Pass_SecondEvent)}, 600)
            setTimeout(() => {player.socket.dispatchEvent(PlayWrongCard)}, 700)
            setTimeout(() => {player.socket.dispatchEvent(PlayQueens)}, 800)

            //setTimeout(() => {player.socket.dispatchEvent(LEAVEENVENT)}, 900)
            //setTimeout(() => {player2.socket.dispatchEvent(LEAVEENVENT1)}, 900)
            //setTimeout(() => {player3.socket.dispatchEvent(LEAVEENVENT2)}, 900)

            await game.runGame();
            expect(player.socket.messageTexts).toContainEqual("{\"error\":\"Action could not be processed!\"}")
        })
    })
})