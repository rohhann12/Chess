"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.count = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.Board = new chess_js_1.Chess();
        this.Move = "";
        this.StartTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.GAME_INIT,
            payload: "white"
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.GAME_INIT,
            payload: "black"
        }));
    }
    makeMove(ws, Move) {
        var _a, _b, _c, _d;
        if (this.count === 0 && ws !== this.player1) {
            console.log("Not player1's turn");
            return;
        }
        if (this.count === 1 && ws !== this.player2) {
            console.log("Not player2's turn");
            return;
        }
        try {
            const result = this.Board.move(Move);
            if (!result) {
                console.log("Invalid move structure or logic");
                return;
            }
        }
        catch (error) {
            console.log("Move error:", error);
            return;
        }
        if (this.Board.isGameOver()) {
            (_a = this.player1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: messages_1.Game_Over,
                playload: {
                    winners: this.Board.turn() === "w" ? "black" : "white"
                }
            }));
            (_b = this.player2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                type: messages_1.Game_Over,
                playload: {
                    winners: this.Board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        if (this.count % 2 === 0) {
            (_c = this.player1) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: Move
            }));
            console.log(Move);
        }
        else {
            (_d = this.player2) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: Move
            }));
        }
        this.count++;
        console.log("count increment:,", this.count);
    }
}
exports.Game = Game;
