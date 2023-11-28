"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresidentCardGame = void 0;
var PresidentPlayer_1 = require("./Players/PresidentPlayer");
var StandardCard_1 = require("./Cards/StandardCard");
var Action_1 = require("./Actions/Action");
var PresidentCardGame = /** @class */ (function () {
    function PresidentCardGame(targetNumberOfPlayers, tableName) {
        this.players = [];
        this.deck = new StandardCard_1.Standard52CardDeck();
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
    PresidentCardGame.prototype.addPlayer = function (Player) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!(Player instanceof PresidentPlayer_1.PresidentPlayer)) {
                reject(false);
            }
            else {
                _this.players.push(Player);
                var game_1 = _this;
                Player.socket.addEventListener("message", function (evt) {
                    if (evt.data.command === Action_1.GameCommand.LEAVE) {
                        var event_1 = new MessageEvent("message", { data: { msg: "no players left" } });
                        game_1.eventReciever.dispatchEvent(event_1);
                        game_1.removePlayer(Player);
                    }
                });
                _this.playerActions.push(null);
                resolve(true);
            }
        });
    };
    PresidentCardGame.prototype.removePlayer = function (Player) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.players.find(function (player) { return Object.is(Player, player); }) === undefined) {
                reject(false);
            }
            else {
                var index = _this.players.indexOf(Player);
                _this.playerActions.splice(index, 1);
                _this.players = _this.players.filter(function (player) { return !Object.is(Player, player); });
                resolve(true);
            }
        });
    };
    PresidentCardGame.prototype.hasPlayers = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.players.length > 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    };
    PresidentCardGame.prototype.dealCards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, player, length, i, card;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        for (_i = 0, _a = this.players; _i < _a.length; _i++) {
                            player = _a[_i];
                            player.resetHand();
                        }
                        return [4 /*yield*/, this.deck.resetDeck()];
                    case 1:
                        _b.sent();
                        length = this.deck.cardArray.length;
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.deck.getRandomCard()];
                    case 3:
                        card = _b.sent();
                        return [4 /*yield*/, this.players[i % this.players.length].addCardToHand(card)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.deck.removeCard(card)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        this.broadcastState();
                        return [2 /*return*/];
                }
            });
        });
    };
    PresidentCardGame.prototype.onlyAcesOnTable = function () {
        if (this.tableValue.every(function (card) { return card.getValue() === StandardCard_1.CardValue.ACE; })) {
            return true;
        }
        return false;
    };
    PresidentCardGame.prototype.NoCardsOnTable = function () {
        if (this.tableValue.length === 0) {
            return true;
        }
        return false;
    };
    PresidentCardGame.prototype.AllEligiblePlayersPassed = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (i === this.turnIndex) {
                continue;
            }
            if (this.playerActions[i] !== Action_1.PresidentCommand.PASS) {
                return false;
            }
        }
        return true;
    };
    PresidentCardGame.prototype.onlyOnePlayerHasCards = function () {
        var count = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].hasCards()) {
                count += 1;
            }
        }
        if (count === 1) {
            return true;
        }
        return false;
    };
    PresidentCardGame.prototype.convertToOldCardType = function (card) {
        var newCard = [];
        if (card["value"] < 10) {
            newCard.push(String(card["value"]));
        }
        else if (card["value"] == 10) {
            newCard.push("10");
        }
        else if (card["value"] == 11) {
            newCard.push("J");
        }
        else if (card["value"] == 12) {
            newCard.push("Q");
        }
        else if (card["value"] == 13) {
            newCard.push("K");
        }
        else if (card["value"] == 14) {
            newCard.push("A");
        }
        if (card["suit"] == 1) {
            newCard.push("D");
        }
        else if (card["suit"] == 2) {
            newCard.push("H");
        }
        else if (card["suit"] == 3) {
            newCard.push("S");
        }
        else if (card["suit"] == 4) {
            newCard.push("C");
        }
        return newCard;
    };
    PresidentCardGame.prototype.broadcastState = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var state = {
                name: _this.tableName,
                playerNames: _this.players.map(function (player) { return player["name"]; }),
                players: _this.players.map(function (player, idx) { return idx; }),
                tableValue: _this.tableValue.map(function (card) { return _this.convertToOldCardType(card); }),
                president: _this.president,
                vicePresident: _this.vicePresident,
                trash: _this.trash,
                viceTrash: _this.viceTrash,
                turn: _this.turnIndex,
                targetNumberOfPlayers: _this.targetNumberOfPlayers,
                phase: _this.phase,
                AllEligiblePlayersPassed: _this.AllEligiblePlayersPassed()
            };
            for (var i = 0; i < _this.players.length; i++) {
                state["id"] = i;
                console.log(JSON.stringify({ state: { msg: "game started", cards: _this.players[i].getHand(), table: state } }));
                _this.players[i].socket.send(JSON.stringify({ state: { msg: "game started", cards: _this.players[i].getHand(), table: state } }));
            }
            resolve(true);
        });
    };
    PresidentCardGame.prototype.GameMoveOK = function (Player, Action) {
        if (Action.command === Action_1.PresidentCommand.PLAY) {
            if (Action.data.cards.length === 0) {
                return false;
            }
            var cardValue_1 = Action.data.cards[0].getValue();
            if (!Action.data.cards.every(function (card) { return card.getValue() === cardValue_1; })) {
                return false;
            }
            if (!Action.data.cards.every(function (card) { return Player.hasCard(card); })) {
                return false;
            }
            if (this.AllEligiblePlayersPassed()) {
                return true;
            }
            if (this.tableValue.length > 0 && this.tableValue[0].getValue() !== StandardCard_1.CardValue.ACE) {
                if (this.tableValue[0].getValue() >= cardValue_1) {
                    return false;
                }
                if (Action.data.cards.length != this.tableValue.length) {
                    return false;
                }
            }
        }
        if (Action.command === Action_1.PresidentCommand.SEND) {
            console.log(Action.data);
            if (Action.data.cards.length === 0) {
                return false;
            }
            if (!Action.data.cards.every(function (card) { return Player.hasCard(card); })) {
                return false;
            }
        }
        return true;
    };
    PresidentCardGame.prototype.determineRoles = function (Player) {
        if (!Player.hasCards()) {
            var NoOfPlayersWithCards = this.players.filter(function (player) { return player.hasCards(); }).length;
            if (this.president === null) {
                this.president = this.players.indexOf(Player);
            }
            else if (NoOfPlayersWithCards >= 2 && this.vicePresident === null) {
                this.vicePresident = this.players.indexOf(Player);
            }
            if (this.vicePresident !== null && NoOfPlayersWithCards === 1) {
                this.viceTrash = this.players.indexOf(Player);
                var trashPlayer = this.players.filter(function (player) { return player.hasCards(); })[0];
                this.trash = this.players.indexOf(trashPlayer);
                this.phase = "exchange";
            }
            if (this.vicePresident === null && NoOfPlayersWithCards === 1) {
                var trashPlayer = this.players.filter(function (player) { return player.hasCards(); })[0];
                this.trash = this.players.indexOf(trashPlayer);
                this.phase = "exchange";
            }
        }
    };
    PresidentCardGame.prototype.roundLogic = function () {
        var _this = this;
        return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var action, _i, _a, card, _b, _c, card;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.players[this.turnIndex].hasCards()) return [3 /*break*/, 2];
                        this.playerActions[this.turnIndex] = Action_1.PresidentCommand.PASS;
                        this.turnIndex = (this.turnIndex + 1) % this.players.length;
                        return [4 /*yield*/, this.broadcastState()];
                    case 1:
                        _d.sent();
                        res(false);
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.players[this.turnIndex].getAction()];
                    case 3:
                        action = _d.sent();
                        if (!this.GameMoveOK(this.players[this.turnIndex], action)) {
                            this.players[this.turnIndex].socket.send(JSON.stringify({ error: "Action could not be processed!" }));
                            res(false);
                            return [2 /*return*/];
                        }
                        this.playerActions[this.turnIndex] = action.command;
                        if (!(action.command === Action_1.PresidentCommand.PASS)) return [3 /*break*/, 5];
                        this.turnIndex = (this.turnIndex + 1) % this.players.length;
                        this.playerActions[this.turnIndex] = Action_1.PresidentCommand.PASS;
                        return [4 /*yield*/, this.broadcastState()];
                    case 4:
                        _d.sent();
                        res(true);
                        return [2 /*return*/];
                    case 5:
                        if (!((this.onlyAcesOnTable() ||
                            this.NoCardsOnTable() ||
                            this.AllEligiblePlayersPassed()) &&
                            action.command === Action_1.PresidentCommand.PLAY)) return [3 /*break*/, 10];
                        this.tableValue = action.data.cards;
                        _i = 0, _a = action.data.cards;
                        _d.label = 6;
                    case 6:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        card = _a[_i];
                        return [4 /*yield*/, this.players[this.turnIndex].removeCardFromHand(card)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        this.determineRoles(this.players[this.turnIndex]);
                        return [3 /*break*/, 16];
                    case 10:
                        if (!(action.command === Action_1.PresidentCommand.PLAY &&
                            action.data.cards[0].getValue() > this.tableValue[0].getValue())) return [3 /*break*/, 15];
                        this.tableValue = action.data.cards;
                        _b = 0, _c = action.data.cards;
                        _d.label = 11;
                    case 11:
                        if (!(_b < _c.length)) return [3 /*break*/, 14];
                        card = _c[_b];
                        return [4 /*yield*/, this.players[this.turnIndex].removeCardFromHand(card)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13:
                        _b++;
                        return [3 /*break*/, 11];
                    case 14:
                        this.determineRoles(this.players[this.turnIndex]);
                        return [3 /*break*/, 16];
                    case 15:
                        this.players[this.turnIndex].socket.send(JSON.stringify({ error: "Action could not be processed!" }));
                        res(false);
                        return [2 /*return*/];
                    case 16:
                        if (this.onlyOnePlayerHasCards()) {
                            res(true);
                            return [2 /*return*/];
                        }
                        if (!this.onlyAcesOnTable()) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.broadcastState()];
                    case 17:
                        _d.sent();
                        res(true);
                        return [2 /*return*/];
                    case 18:
                        this.turnIndex = (this.turnIndex + 1) % this.players.length;
                        return [4 /*yield*/, this.broadcastState()];
                    case 19:
                        _d.sent();
                        res(true);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PresidentCardGame.prototype.exchangePhase = function () {
        var _this = this;
        return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var p1, p2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.vicePresident !== null) {
                            p1 = this.ExchangeCards(this.vicePresident, this.viceTrash, 1);
                        }
                        if (this.president !== null) {
                            p2 = this.ExchangeCards(this.president, this.trash, 2);
                        }
                        if (!(p1 && p2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all([p1, p2])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: 
                    // it should not be possiblie for p1 to be defined while p2 is undefined: By game logic!
                    return [4 /*yield*/, p2];
                    case 3:
                        // it should not be possiblie for p1 to be defined while p2 is undefined: By game logic!
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        res(true);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PresidentCardGame.prototype.runPlayPhase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var game;
            var _this = this;
            return __generator(this, function (_a) {
                game = this;
                return [2 /*return*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, game.roundLogic()];
                                case 1:
                                    _a.sent();
                                    if (!game.onlyOnePlayerHasCards()) return [3 /*break*/, 2];
                                    res(true);
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, game.runPlayPhase()];
                                case 3:
                                    result = _a.sent();
                                    res(result);
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PresidentCardGame.prototype.runRound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var game;
            var _this = this;
            return __generator(this, function (_a) {
                game = this;
                return [2 /*return*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, game.dealCards()];
                                case 1:
                                    _a.sent();
                                    this.tableValue = [];
                                    return [4 /*yield*/, game.exchangePhase()];
                                case 2:
                                    _a.sent();
                                    if (this.president !== null) {
                                        this.turnIndex = this.president;
                                    }
                                    else {
                                        this.turnIndex = 0;
                                    }
                                    this.president = null;
                                    this.vicePresident = null;
                                    this.viceTrash = null;
                                    this.trash = null;
                                    this.tableValue = [];
                                    this.phase = "round";
                                    return [4 /*yield*/, this.broadcastState()];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, game.runPlayPhase()];
                                case 4:
                                    _a.sent();
                                    if (game.onlyOnePlayerHasCards()) {
                                        res(true);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, game.runRound()];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PresidentCardGame.prototype.ExchangeCards = function (fromIndex, toIndex, numberOfCards) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var action, cardsFrom, _i, cardsFrom_1, card, _a, _b, card, e_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.players[fromIndex].getAction()];
                                case 1:
                                    action = _c.sent();
                                    if (action.command === Action_1.PresidentCommand.SEND && action.data.cards.length == numberOfCards) {
                                        this.players[toIndex].hand.cardArray.sort(function (a, b) {
                                            if (a["value"] == b["value"]) {
                                                return a["suit"] - b["suit"];
                                            }
                                            else {
                                                return a["value"] - b["value"];
                                            }
                                        });
                                        cardsFrom = this.players[toIndex].hand.cardArray.slice(this.players[toIndex].hand.cardArray.length - numberOfCards);
                                        for (_i = 0, cardsFrom_1 = cardsFrom; _i < cardsFrom_1.length; _i++) {
                                            card = cardsFrom_1[_i];
                                            this.players[toIndex].removeCardFromHand(card);
                                            this.players[fromIndex].addCardToHand(card);
                                        }
                                        for (_a = 0, _b = action.data.cards; _a < _b.length; _a++) {
                                            card = _b[_a];
                                            this.players[fromIndex].removeCardFromHand(card);
                                            this.players[toIndex].addCardToHand(card);
                                        }
                                        resolve(true);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _c.sent();
                                    console.log(e_1);
                                    resolve(false);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PresidentCardGame.prototype.runGame = function () {
        var _this = this;
        var game = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game.eventReciever.addEventListener("message", function (evt) {
                            if (evt.data.msg === "no players left") {
                                console.log("no players left");
                                resolve("no players left");
                            }
                        });
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, game.runRound()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    PresidentCardGame.prototype.run = function () {
        return new Promise(function (res) {
            res("This is complete.");
        });
    };
    return PresidentCardGame;
}());
exports.PresidentCardGame = PresidentCardGame;
