"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardCard = exports.Standard52CardDeck = exports.CardSubList = exports.CardSuit = exports.CardValue = void 0;
function enumKeys(obj) {
    return Object.keys(obj).filter(function (k) { return Number.isNaN(+k); });
}
var CardValue;
(function (CardValue) {
    CardValue[CardValue["TWO"] = 2] = "TWO";
    CardValue[CardValue["THREE"] = 3] = "THREE";
    CardValue[CardValue["FOUR"] = 4] = "FOUR";
    CardValue[CardValue["FIVE"] = 5] = "FIVE";
    CardValue[CardValue["SIX"] = 6] = "SIX";
    CardValue[CardValue["SEVEN"] = 7] = "SEVEN";
    CardValue[CardValue["EIGHT"] = 8] = "EIGHT";
    CardValue[CardValue["NINE"] = 9] = "NINE";
    CardValue[CardValue["TEN"] = 10] = "TEN";
    CardValue[CardValue["JACK"] = 11] = "JACK";
    CardValue[CardValue["QUEEN"] = 12] = "QUEEN";
    CardValue[CardValue["KING"] = 13] = "KING";
    CardValue[CardValue["ACE"] = 14] = "ACE";
})(CardValue || (exports.CardValue = CardValue = {}));
var CardSuit;
(function (CardSuit) {
    CardSuit[CardSuit["DIAMOND"] = 1] = "DIAMOND";
    CardSuit[CardSuit["HEARTS"] = 2] = "HEARTS";
    CardSuit[CardSuit["SPADES"] = 3] = "SPADES";
    CardSuit[CardSuit["CLUBS"] = 4] = "CLUBS";
})(CardSuit || (exports.CardSuit = CardSuit = {}));
var SuperList = /** @class */ (function () {
    function SuperList(cards) {
        this.cardArray = cards;
    }
    SuperList.prototype.isCard = function (card) {
        if (this.cardArray.find(function (card2) { return card2.getType() === card.getType(); })) {
            return true;
        }
        return false;
    };
    return SuperList;
}());
var CardSubList = /** @class */ (function () {
    function CardSubList(superList, cards) {
        if (cards === void 0) { cards = []; }
        this.superList = superList;
        this.cardArray = cards;
    }
    CardSubList.prototype.addCard = function (card) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isCard(card) && !_this.cardInList(card)) {
                _this.cardArray.push(card);
                resolve(true);
            }
            else {
                reject(false);
            }
        });
    };
    ;
    CardSubList.prototype.reset = function () {
        this.cardArray = [];
    };
    CardSubList.prototype.removeCard = function (card) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.cardInList(card)) {
                _this.cardArray = _this.cardArray.filter(function (card1) { return card1.getType() !== card.getType(); });
                resolve(true);
            }
            else {
                reject(false);
            }
        });
    };
    ;
    CardSubList.prototype.getRandomCard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idx = Math.floor(Math.random() * _this.cardArray.length);
            resolve(_this.cardArray[idx]);
        });
    };
    ;
    CardSubList.prototype.cardInList = function (card) {
        if (this.cardArray.find(function (card1) { return card1.getType() === card.getType(); })) {
            return true;
        }
        return false;
    };
    ;
    CardSubList.prototype.isCard = function (card) {
        return this.superList.isCard(card);
    };
    return CardSubList;
}());
exports.CardSubList = CardSubList;
var Standard52CardDeck = /** @class */ (function (_super) {
    __extends(Standard52CardDeck, _super);
    function Standard52CardDeck() {
        var _this = 
        // make complete deck:
        _super.call(this, new SuperList([]), []) || this;
        _this.cardArray = [];
        for (var _i = 0, _a = enumKeys(CardValue); _i < _a.length; _i++) {
            var value = _a[_i];
            for (var _b = 0, _c = enumKeys(CardSuit); _b < _c.length; _b++) {
                var suit = _c[_b];
                var newCard = new StandardCard(CardValue[value], CardSuit[suit]);
                _this.cardArray.push(newCard);
            }
        }
        _this.superList = new SuperList(_this.cardArray);
        return _this;
    }
    Standard52CardDeck.prototype.resetDeck = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.cardArray = [];
            for (var _i = 0, _a = enumKeys(CardValue); _i < _a.length; _i++) {
                var value = _a[_i];
                for (var _b = 0, _c = enumKeys(CardSuit); _b < _c.length; _b++) {
                    var suit = _c[_b];
                    var newCard = new StandardCard(CardValue[value], CardSuit[suit]);
                    _this.cardArray.push(newCard);
                }
            }
            resolve(true);
        });
    };
    Standard52CardDeck.prototype.getRandomCard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var idx = Math.floor(Math.random() * _this.cardArray.length);
            resolve(_this.cardArray[idx]);
        });
    };
    ;
    Standard52CardDeck.prototype.AllCardsSameValue = function () {
        if (this.cardArray.length === 0) {
            return true;
        }
        var firstValue = this.cardArray[0].getValue();
        for (var _i = 0, _a = this.cardArray; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.getValue() !== firstValue) {
                return false;
            }
        }
        return true;
    };
    return Standard52CardDeck;
}(CardSubList));
exports.Standard52CardDeck = Standard52CardDeck;
var StandardCard = /** @class */ (function () {
    function StandardCard(value, suit) {
        this.value = value;
        this.suit = suit;
    }
    StandardCard.fromStringArray = function (array) {
        if (array.length != 2) {
            return false;
        }
        var value = false;
        var suit = false;
        switch (array[0]) {
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
        switch (array[1]) {
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
        if (suit !== false && value !== false) {
            return new StandardCard(value, suit);
        }
        return false;
    };
    StandardCard.prototype.getValue = function () {
        return this.value;
    };
    StandardCard.prototype.getSuit = function () {
        return this.suit;
    };
    StandardCard.prototype.getType = function () {
        return String(this.value) + "," + String(this.suit);
    };
    return StandardCard;
}());
exports.StandardCard = StandardCard;
