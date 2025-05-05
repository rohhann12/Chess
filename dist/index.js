"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const game = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    game.addUser(ws);
    ws.on("disconnect", () => game.removeUser(ws));
    ws.send('something');
});
