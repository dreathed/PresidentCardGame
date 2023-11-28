import { Standard52CardDeck, StandardCard, CardValue, CardSuit, Card } from "../CardGames/Cards/StandardCard";
const Deck = require("../CardGames/Cards/Icards").Standard52Deck;


describe("tests for: Standard52Deck", () => {
    describe("isCard tests", () => {
        describe("test if all cards are recognized as cards", () => {
    
            test("tests wheter '2D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("2D")).toBe(true);
            })
        
            test("tests wheter '2H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("2H")).toBe(true);
            })
        
            test("tests wheter '2S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("2S")).toBe(true);
            })
        
            test("tests wheter '2C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("2C")).toBe(true);
            })
        
        
            test("tests wheter '3D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("3D")).toBe(true);
            })
        
            test("tests wheter '3H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("3H")).toBe(true);
            })
        
            test("tests wheter '3S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("3S")).toBe(true);
            })
        
            test("tests wheter '3C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("3C")).toBe(true);
            })
        
        
            test("tests wheter '4D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("4D")).toBe(true);
            })
        
            test("tests wheter '4H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("4H")).toBe(true);
            })
        
            test("tests wheter '4S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("4S")).toBe(true);
            })
        
            test("tests wheter '4C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("4C")).toBe(true);
            })
        
        
            test("tests wheter '5D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("5D")).toBe(true);
            })
        
            test("tests wheter '5H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("5H")).toBe(true);
            })
        
            test("tests wheter '5S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("5S")).toBe(true);
            })
        
            test("tests wheter '5C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("5C")).toBe(true);
            })
        
        
            test("tests wheter '6D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("6D")).toBe(true);
            })
        
            test("tests wheter '6H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("6H")).toBe(true);
            })
        
            test("tests wheter '6S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("6S")).toBe(true);
            })
        
            test("tests wheter '6C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("6C")).toBe(true);
            })
        
        
            test("tests wheter '7D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("7D")).toBe(true);
            })
        
            test("tests wheter '7H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("7H")).toBe(true);
            })
        
            test("tests wheter '7S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("7S")).toBe(true);
            })
        
            test("tests wheter '7C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("7C")).toBe(true);
            })
        
        
            test("tests wheter '8D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("8D")).toBe(true);
            })
        
            test("tests wheter '8H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("8H")).toBe(true);
            })
        
            test("tests wheter '8S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("8S")).toBe(true);
            })
        
            test("tests wheter '8C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("8C")).toBe(true);
            })
        
        
            test("tests wheter '9D' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("9D")).toBe(true);
            })
        
            test("tests wheter '9H' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("9H")).toBe(true);
            })
        
            test("tests wheter '9S' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("9S")).toBe(true);
            })
        
            test("tests wheter '9C' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("9C")).toBe(true);
            })
        
        
            test("tests wheter 'TD' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("TD")).toBe(true);
            })
        
            test("tests wheter 'TH' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("TH")).toBe(true);
            })
        
            test("tests wheter 'TS' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("TS")).toBe(true);
            })
        
            test("tests wheter 'TC' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("TC")).toBe(true);
            })
        
        
            test("tests wheter 'JD' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("JD")).toBe(true);
            })
        
            test("tests wheter 'JH' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("JH")).toBe(true);
            })
        
            test("tests wheter 'JS' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("JS")).toBe(true);
            })
        
            test("tests wheter 'JC' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("JC")).toBe(true);
            })
        
        
            test("tests wheter 'QD' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("QD")).toBe(true);
            })
        
            test("tests wheter 'QH' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("QH")).toBe(true);
            })
        
            test("tests wheter 'QS' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("QS")).toBe(true);
            })
        
            test("tests wheter 'QC' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("QC")).toBe(true);
            })
        
        
            test("tests wheter 'KD' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("KD")).toBe(true);
            })
        
            test("tests wheter 'KH' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("KH")).toBe(true);
            })
        
            test("tests wheter 'KS' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("KS")).toBe(true);
            })
        
            test("tests wheter 'KC' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("KC")).toBe(true);
            })
        
            test("tests wheter 'AD' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("AD")).toBe(true);
            })
        
            test("tests wheter 'AH' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("AH")).toBe(true);
            })
        
            test("tests wheter 'AS' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("AS")).toBe(true);
            })
        
            test("tests wheter 'AC' is a card of the deck", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("AC")).toBe(true);
            })
            
            
        })
        
        describe("test if the things that should not be cards are recognized as such", () => {
        
            test("'72D' should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard('72D')).toBe(false);
            })
        
            test("8 should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard(8)).toBe(false);
            })
        
            test("An instance of StandardDeck should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard(myDeck)).toBe(false);
            })
        
            test("1.5 should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard(1.5)).toBe(false);
            })
        
            test("null should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard(null)).toBe(false);
            })
        
            test("undefined should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard(undefined)).toBe(false);
            })
        
            test("'D7' should not be a card", () => {
                let myDeck = new Deck();
                expect(myDeck.isCard("D7")).toBe(false);
            })
        })
    
        describe("even after removing a card of the deck, what a card is, should still work!", () => {
            test("'72D' should not be a card", () => {
                let myDeck = new Deck();
                myDeck.removeCard("7D")
                expect(myDeck.isCard('72D')).toBe(false);
            })
    
            test("tests wheter '2D' is a card of the deck", () => {
                let myDeck = new Deck();
                myDeck.removeCard("2D")
                expect(myDeck.isCard("2D")).toBe(true);
            })
        })
    })
    
    
    describe("value higher than tests", () => {
        describe("if not a card a value error should be thrown", () => {
            test("a number as argument should raise a type error", () => {
                let myDeck = new Deck();
                expect(() => {
                    myDeck.valueHigherThan(8, "7H")
                }).toThrow(new TypeError("Both arguments for valueHigherThan must be cards."))
            })
    
            test("a string that is not a number as argument should raise a type error", () => {
                let myDeck = new Deck();
                expect(() => {
                    myDeck.valueHigherThan("not a card", "T8")
                }).toThrow(new TypeError("Both arguments for valueHigherThan must be cards."))
            })
        })
    
        describe("should return true, when the first argument is bigger (as a card) as the second argument", () => {
            test("('6H', '4C') should return true", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("6H", "4C")).toBe(true);
            })
    
            test("('JH', 'TC') should return true", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("JH", "TC")).toBe(true);
            })
    
            test("('3D', '2D') should return true", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("3D", "2D")).toBe(true);
            })
    
            test("('QH', 'TC') should return true", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("QH", "TC")).toBe(true);
            })
        })
    
        describe("should return false, when the first argument is smaller or equal to the second argument.", () => {
            test("('TC', 'QH') should return false", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("TC", "QH")).toBe(false);
            })
    
            test("('TC', 'TH') should return false", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("TC", "QH")).toBe(false);
            })
    
            test("('9C', 'KD') should return false", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("TC", "QH")).toBe(false);
            })
    
            test("('2D', '5C') should return false", () => {
                let myDeck = new Deck();
                expect(myDeck.valueHigherThan("TC", "QH")).toBe(false);
            })
        })
    })
    
    
    describe("tests for cardIsInList: ", () => {
        describe("cardIsInList should be true for all the cards, when no card waas removed: ", () => {
            test("tests wheter '2D' is in the list", () => {
                let myDeck = new Deck();
                expect(myDeck.cardIsInList("2D")).toBe(true);
            })

            test("tests wheter 'QH' is in the list", () => {
                let myDeck = new Deck();
                expect(myDeck.cardIsInList("QH")).toBe(true);
            })

            test("tests wheter 'AC' is in the list", () => {
                let myDeck = new Deck();
                expect(myDeck.cardIsInList("AC")).toBe(true);
            })

            test("tests wheter '7D' is in the list", () => {
                let myDeck = new Deck();
                expect(myDeck.cardIsInList("AC")).toBe(true);
            })
        })

        describe("cardIsInList should be false, if the card has been removed: ", () => {
            test("tests wheter 'QH' was removed", () => {
                let myDeck = new Deck();
                myDeck.removeCard("QH")
                expect(myDeck.cardIsInList("QH")).toBe(false);
            })

            test("tests wheter '8C' was removed", () => {
                let myDeck = new Deck();
                myDeck.removeCard("8C")
                expect(myDeck.cardIsInList("8C")).toBe(false);
            })
        })

        describe("should return false, when the card to remove is not a card", () => {
            test("int 8 should return false", () => {
                let myDeck = new Deck();
                myDeck.removeCard(8);
                expect(myDeck.cardIsInList(8)).toBe(false);
            })
        })
    })

    describe("test new StandardCardDeck", () => {
        describe("new StandardCardDeck should contain all the cards", () => {
            test("new StandardCardDeck should contain the card '5H'", () => {
                let myDeck = new Standard52CardDeck();
                expect(myDeck.isCard(new StandardCard(CardValue.FIVE, CardSuit.HEARTS))).toBe(true)
            })

            test("new StandardCardDeck should not contain something else", () => {
                let myDeck = new Standard52CardDeck();
                expect(myDeck.isCard(new StandardCard("Five", "Hearts"))).toBe(false)
            })

            test("new StandardCardDeck: after remove a card", async () => {
                let myDeck = new Standard52CardDeck();
                await myDeck.removeCard(new StandardCard(CardValue.TWO, CardSuit.DIAMOND));
                expect(myDeck.cardInList(new StandardCard(CardValue.TWO, CardSuit.DIAMOND))).toBe(false)
            })

            test("new StandardCardDeck: getRandomCard should return a Promise that resolves to a Card", async () => {
                let myDeck = new Standard52CardDeck();
                let card = await myDeck.getRandomCard();
                expect(card).toBeInstanceOf(StandardCard)
            })

            test("new StandardCardDeck: getRandomCard should get a card that is part of the deck", async () => {
                let myDeck = new Standard52CardDeck();
                let card = await myDeck.getRandomCard();
                expect(myDeck.cardInList(card)).toBe(true);
            })

            test("new StandardCardDeck: addCard should add the card back, when it was removed before", async () => {
                let myDeck = new Standard52CardDeck();
                await myDeck.removeCard(new StandardCard(CardValue.TWO, CardSuit.DIAMOND));
                await myDeck.addCard(new StandardCard(CardValue.TWO, CardSuit.DIAMOND))
                expect(myDeck.cardInList(new StandardCard(CardValue.TWO, CardSuit.DIAMOND))).toBe(true);
            })
        })
    }) 
})
