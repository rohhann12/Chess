import { WebSocket } from "ws";
import { Chess } from 'chess.js';
import { GAME_INIT, Game_Over, MOVE, TIME_UPDATE } from "./messages";

export class Game {
    public player1: WebSocket | null;
    public player2: WebSocket | null;
    private Board: Chess;
    private Move: string;
    private count = 0;
    private currentTurn: string;
    private timeLeft: number;
    private timerInterval: NodeJS.Timeout | null = null;
    barikiskihai: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.Board = new Chess();
        this.Move = "";
        this.barikiskihai = 0;
        this.currentTurn = "white";
        this.timeLeft = 120;

        this.player1.send(JSON.stringify({
            type: GAME_INIT,
            payload: "black"
        }));

        this.player2.send(JSON.stringify({
            type: GAME_INIT,
            payload: "white"
        }));
    }

    private broadcast(data: any) {
        this.player1?.send(JSON.stringify(data));
        this.player2?.send(JSON.stringify(data));
    }

    public startTimer() {
        this.barikiskihai = this.count;
        this.currentTurn = this.barikiskihai % 2 === 0 ? "white" : "black";
        this.timeLeft = 120;

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            this.broadcast({
                type: TIME_UPDATE,
                payload: {
                    currentTurn: this.currentTurn,
                    timeLeft: this.timeLeft
                }
            });
            // idhr logic to change turns ni h 
            // isiliye maine bari bheji aur kuch hua ni 
            
            if (this.timeLeft <= 0) {   
                // Time over: switch turn
                this.count++;
                this.startTimer(); // Restart timer for next turn
            }
        }, 1000);
    }

    public makeMove(ws: WebSocket, Move: { from: string, to: string }) {
        // Check whose turn it is
        const isWhiteTurn = this.count % 2 === 0; //even h count
        if ((isWhiteTurn && ws !== this.player2) || (!isWhiteTurn && ws !== this.player1)) {
            console.log(this.count)
            console.log(isWhiteTurn)
            console.log("Not your turn");
            return;
        }
        const result = this.Board.move(Move);
        if (!result) {
            console.log("Invalid move");
            return;
        }

        // Send move to both players
        this.broadcast({
            type: MOVE,
            payload: Move
        });

        // Check for game over
        if (this.Board.isGameOver()) {
            this.broadcast({
                type: Game_Over,
                payload: {
                    winner: this.Board.turn() === "w" ? "black" : "white"
                }
            });
            if (this.timerInterval) clearInterval(this.timerInterval);
            return;
        }

        // Switch turn and restart timer
        this.count++;
        this.startTimer();
    }
}
