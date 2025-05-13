import { WebSocket } from "ws"
import { GAME_INIT, MOVE } from "./messages"
import { Game } from "./Game"

export class GameManager {
    private Game: Game[]
    private users: WebSocket[]
    private pendingUser: WebSocket | null

    constructor() {
        this.Game = []
        this.users = []
        this.pendingUser = null
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(users => users !== socket)
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString())

            if (message.type === GAME_INIT) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.Game.push(game);
                    this.pendingUser = null;
                    game.startTimer(); // Start the timer for the game
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.Game.find(game => game.player1 === socket || game.player2 === socket)
                if (game) {
                    game.makeMove(socket, message.Move)
                    // game.startTimer()
                }
            }
        })
    }
}
