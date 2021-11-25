import Helper from "./Helper";

export interface Move {
    i: number,
    j: number,
    evaluation?: number
}

export class Ai {

    public static AI_MODE = 2;

    public static aiMove(field: number[][]) {
        if (Ai.AI_MODE === 1) {
            Ai.randomAiMove(field);
        } else {
            const move = Ai.treeSearchAiMove(field, Helper.P_AI);
            if (move) {
                field[move.i][move.j] = Helper.P_AI;
            } else {
                throw new Error("Kein Move!");
            }
        }
    }

    public static randomAiMove(field: number[][]) {
        let moved = false;
        while (!moved) {
            let i = Math.floor(Math.random() * 3);
            let j = Math.floor(Math.random() * 3);
            if (Helper.isNotTaken(field, i, j)) {
                field[i][j] = Helper.P_AI;
                moved = true;
            }
        }
    }


    public static treeSearchAiMove(field: number[][], player: number): Move | null {

        const moves: Move[] = this.getValidMoves(field);

        let bestMoveEval: number = -2;
        let bestMove: Move | null = null;


        for (let i: number = 0; i < moves.length; i++) {
            const move: Move = moves[i];
            const fieldCp: number[][] = JSON.parse(JSON.stringify(field));
            fieldCp[move.i][move.j] = Helper.P_AI;
            //const result: number = this.evaluateMoveDeep(fieldCp, Helper.P_AI);

            let result = Helper.calculateResult(field, player);
            if (result >= bestMoveEval) {
                bestMoveEval = result;
                bestMove = move;
            }

            //Spiel ended hier...
            if(result !== 0) {
                continue;
            }
            result = this.evaluateMoveDeep(fieldCp, Helper.P_HU);

            if (result >= bestMoveEval) {
                bestMoveEval = result;
                bestMove = move;
            }
            
        }

        if(bestMove){
            bestMove.evaluation = bestMoveEval;
        }
        return bestMove;
    }

    public static evaluateMoveDeep(field: number[][], player: number): number {
        const moves: Move[] = this.getValidMoves(field);
        let bestMoveEval: number = -2;
        let otherPlayer = player === Helper.P_AI ? Helper.P_HU : Helper.P_AI;

        for (let i: number = 0; i < moves.length; i++) {
            const move: Move = moves[i];
            const fieldCp: number[][] = JSON.parse(JSON.stringify(field));
            fieldCp[move.i][move.j] = Helper.P_AI;

            let result = Helper.calculateResult(fieldCp, otherPlayer);
            if(result !== 0) {
                if (result >= bestMoveEval) {
                    bestMoveEval = result;
                }
                continue;
            }
            result = this.evaluateMoveDeep(fieldCp, otherPlayer);
            if (result >= bestMoveEval) {
                bestMoveEval = result;
            }
        }

        return bestMoveEval;

    }


    public static getValidMoves(field: number[][]): Move[] {
        let moves: Move[] = [];
        for (let i: number = 0; i < field.length; i++) {
            for (let j: number = 0; j < field.length; j++) {
                if (field[i][j] === 0) {
                    moves.push({i, j});
                }
            }
        }
        return moves;
    }

    public static toLinearArray(field: number[][]): number[] {
        let linearArray: number[] = [];
        let linearIndex = 0;

        for (let i: number = 0; i < field.length; i++) {
            for (let j: number = 0; j < field.length; j++) {
                linearArray[linearIndex] = field[i][j];
                linearIndex++;
            }
        }

        return linearArray;
    }


}