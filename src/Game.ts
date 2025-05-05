import { WebSocket } from "ws";
import { Chess } from 'chess.js';
import { GAME_INIT, Game_Over, MOVE } from "./messages";
export class Game{
    public player1:WebSocket | null;
    public player2:WebSocket | null;
    
    private Board:Chess
    private Move:String
    private StartTime:Date
    private count=0;
    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1
        this.player2=player2
        this.Board=new Chess()
        this.Move=""
        this.StartTime=new Date()
        this.player1.send(JSON.stringify({
            type:GAME_INIT,
            payload:"white"
        }))
        this.player2.send(JSON.stringify({
            type:GAME_INIT,
            payload:"black"
        }))
    }

    public makeMove(ws:WebSocket,Move:{
        from:string,
        to:string
    }){
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
        } catch (error) {
            console.log("Move error:", error);
            return;
        }
        
        if(this.Board.isGameOver()){
            this.player1?.send(JSON.stringify({
                type:Game_Over,
                playload:{
                    winners:this.Board.turn()==="w"? "black" :"white"
                }
            }))
            this.player2?.send(JSON.stringify({
                type:Game_Over,
                playload:{
                    winners:this.Board.turn()==="w"? "black" :"white"
                }
            }))
        }
        if(this.count %2===0){
            this.player1?.send(JSON.stringify({
                type:MOVE,
                payload:Move
            }))
            console.log(Move)
        }else{
            this.player2?.send(JSON.stringify({
                type:MOVE,
                payload:Move
            }))
        }
        
        this.count++;
        console.log("count increment:,",this.count)
    }

}