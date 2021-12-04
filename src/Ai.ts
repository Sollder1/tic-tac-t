import Helper from "./Helper";
import {AI_Node} from "./AiDawip";

export interface Move {
    i: number,
    j: number,
    evaluation?: number
}

export class Ai {

    private static MAX_DEPTH: number = 100;

    public static aiMove(field: number[][], algorithm: number) {
        if (algorithm === 1) {
            Ai.randomAiMove(field);
        } else if (algorithm === 2) {
            const move = Ai.treeSearchAiMove(field);
            if (move) {
                field[move.i][move.j] = Helper.P_AI;
            } else {
                throw new Error("Kein Move!");
            }
        } else if (algorithm === 3) {
            const move = AI_Node.calc_move(field, true);
            console.log(move)
            field[Math.floor(move / 3)][move % 3] = Helper.P_AI;
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


    public static treeSearchAiMove(field: number[][]): Move | null {

        const moves: Move[] = this.getValidMoves(field);

        let bestMoveEval: number = -2;
        let bestMove: Move | null = null;

        for (let i: number = 0; i < moves.length; i++) {

            const fieldCp: number[][] = JSON.parse(JSON.stringify(field));
            const move: Move = moves[i];
            fieldCp[move.i][move.j] = Helper.P_AI;

            let result = this.evaluateMoveDeep(fieldCp, Helper.P_HU, 0);
            if (result > bestMoveEval) {
                bestMoveEval = result;
                bestMove = moves[i];
            }
            console.log(bestMoveEval);
        }

        if (bestMove) {
            bestMove.evaluation = bestMoveEval;
        }
        return bestMove;
    }

    public static evaluateMoveDeep(field: number[][], player: number, depth: number): number {
        const moves: Move[] = this.getValidMoves(field);
        let moveEvals: number[] = [];
        let otherPlayer = (player === Helper.P_AI ? Helper.P_HU : Helper.P_AI);

        if (moves.length === 0 || depth > Ai.MAX_DEPTH) {
            return Helper.calculateResult(field, Helper.P_AI);
        }

        for (let i: number = 0; i < moves.length; i++) {
            const move: Move = moves[i];
            const fieldCp: number[][] = JSON.parse(JSON.stringify(field));
            fieldCp[move.i][move.j] = player;
            let result = this.evaluateMoveDeep(fieldCp, otherPlayer, ++depth);
            moveEvals.push(result);
        }

        if (player === Helper.P_AI) {
            return Math.max(...moveEvals);
        } else {
            return Math.min(...moveEvals);
        }
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