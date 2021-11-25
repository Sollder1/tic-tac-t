import Helper from "./Helper";

export default class Ai {

    public static AI_MODE = 1;

    public static aiMove(field: number[][]) {
        if (Ai.AI_MODE === 1) {
            Ai.randomAiMove(field);
        } else {
            Ai.treeSearchAiMove(field);
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

    public static treeSearchAiMove(field: number[][]) {

    }

}