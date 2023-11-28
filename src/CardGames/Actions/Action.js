"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresidentAction = exports.GameAction = exports.GameCommand = exports.PresidentCommand = void 0;
var PresidentCommand;
(function (PresidentCommand) {
    PresidentCommand["PLAY"] = "playCards";
    PresidentCommand["PASS"] = "PASS";
    PresidentCommand["SEND"] = "SEND";
})(PresidentCommand || (exports.PresidentCommand = PresidentCommand = {}));
var GameCommand;
(function (GameCommand) {
    GameCommand["LEAVE"] = "LEAVE";
    GameCommand["JOIN"] = "JOIN";
    GameCommand["CREATE"] = "CREATE";
})(GameCommand || (exports.GameCommand = GameCommand = {}));
var GameAction = /** @class */ (function () {
    function GameAction(command, data) {
        this.command = command;
        this.data = data;
    }
    return GameAction;
}());
exports.GameAction = GameAction;
var PresidentAction = /** @class */ (function () {
    function PresidentAction(command, data) {
        if ((command === PresidentCommand.PLAY || command === PresidentCommand.SEND) && data.cards.length === 0) {
            throw new Error("If command is PLAY or SEND data.cards must contain cards!");
        }
        if (command === PresidentCommand.PASS && data.cards.length !== 0) {
            throw new Error("If command is PASS data.cards can not contain cards!");
        }
        this.command = command;
        this.data = data;
    }
    return PresidentAction;
}());
exports.PresidentAction = PresidentAction;
