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
exports.PresidentPlayer = void 0;
var Action_1 = require("../Actions/Action");
var StandardCard_1 = require("../Cards/StandardCard");
var PresidentPlayer = /** @class */ (function () {
    function PresidentPlayer(socket, deck, GameEventReviever) {
        var _this = this;
        this.socket = socket;
        this.hand = new StandardCard_1.CardSubList(deck, []);
        this.name = socket.playerName;
        this.socket.addEventListener("message", function (msg) {
            try {
                var msgObj = JSON.parse(msg);
                if (!msgObj.hasOwnProperty("data")) {
                    return;
                }
                if (!msgObj.hasOwnProperty("command")) {
                    return;
                }
                if (msgObj.command == "changeName") {
                    _this.name = String(msgObj.data);
                    _this.socket.send(JSON.stringify({ state: { success: "Player name changed to: " + _this.name } }));
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        this.getAction = this.getAction.bind(this);
    }
    PresidentPlayer.prototype.resetHand = function () {
        this.hand.reset();
    };
    PresidentPlayer.prototype.getHand = function () {
        // because the interface is still not quite right...
        var returnValue = [];
        this.hand.cardArray.sort(function (a, b) {
            if (a["value"] == b["value"]) {
                return a["suit"] - b["suit"];
            }
            else {
                return a["value"] - b["value"];
            }
        });
        for (var _i = 0, _a = this.hand.cardArray; _i < _a.length; _i++) {
            var card = _a[_i];
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
            returnValue.push(newCard);
        }
        return returnValue;
    };
    PresidentPlayer.prototype.removeCardFromHand = function (card) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hand.removeCard(card)];
            });
        });
    };
    PresidentPlayer.prototype.getAction = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var socket = _this.socket;
            _this.socket.addEventListener("message", function ActionHandler(evt) {
                var msgObj = JSON.parse(evt.data);
                if (msgObj["command"] == "playCards") {
                    if (msgObj["data"].length == 0) {
                        msgObj["command"] = Action_1.PresidentCommand.PASS;
                        resolve(msgObj);
                        socket.removeEventListener("message", ActionHandler);
                        return;
                    }
                    var newData = [];
                    for (var _i = 0, _a = msgObj["data"]; _i < _a.length; _i++) {
                        var card = _a[_i];
                        var newCard = StandardCard_1.StandardCard.fromStringArray(card);
                        if (newCard !== false) {
                            newData.push(newCard);
                        }
                        else {
                            throw new Error("card " + String(card) + " could not be created...");
                        }
                    }
                    msgObj.data.cards = newData;
                }
                if (msgObj["command"] == Action_1.PresidentCommand.SEND) {
                    var newData = [];
                    for (var _b = 0, _c = msgObj["data"]; _b < _c.length; _b++) {
                        var card = _c[_b];
                        var newCard = StandardCard_1.StandardCard.fromStringArray(card);
                        if (newCard !== false) {
                            newData.push(newCard);
                        }
                        else {
                            throw new Error("card " + String(card) + " could not be created...");
                        }
                    }
                    msgObj.data.cards = newData;
                }
                resolve(msgObj);
                socket.removeEventListener("message", ActionHandler);
            });
        });
    };
    PresidentPlayer.prototype.setName = function (name) {
        this.name = name;
        this.socket.send(JSON.stringify({ msg: "changed Name" }));
    };
    PresidentPlayer.prototype.addCardToHand = function (card) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hand.addCard(card)];
            });
        });
    };
    PresidentPlayer.prototype.hasCards = function () {
        return this.hand.cardArray.length !== 0;
    };
    PresidentPlayer.prototype.hasCard = function (card) {
        return this.hand.cardInList(card);
    };
    PresidentPlayer.prototype.leaveTable = function () {
        return new Promise(function (resolve) {
        });
    };
    return PresidentPlayer;
}());
exports.PresidentPlayer = PresidentPlayer;
