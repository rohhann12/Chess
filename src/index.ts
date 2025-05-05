import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const game=new GameManager()
wss.on('connection', function connection(ws) {
    game.addUser(ws)
  ws.on("disconnect",()=> game.removeUser(ws))
  ws.send('something');
});