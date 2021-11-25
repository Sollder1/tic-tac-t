
export default class Helper {


    public static P_HU = 1;
    public static P_AI = 2;

    /*
 Ergebnisse:
     -1: Verloren
      0: Läuft weiter
      1: Unentscheiden
      2: Sieg
 player:
     1: Mensch
     2: KI
  */
    public static calculateResult(field: number[][], player: number) {

        const grid = field;
        const otherPlayer = player === Helper.P_AI ? Helper.P_HU : Helper.P_AI;

        //Gewonnen und wenn ja, wer?
        for (let i: number = 0; i < 2; i++) {
            const evalVertical: number[] = [grid[i][0], grid[i][1], grid[i][2]];
            const evalHorizontal: number[] = [grid[0][i], grid[1][i], grid[2][i]];

            if (Helper.eval(evalHorizontal, player) || Helper.eval(evalVertical, player)) {
                return 2;
            } else if (Helper.eval(evalHorizontal, otherPlayer) || Helper.eval(evalVertical, otherPlayer)) {
                return -1;
            }
        }

        const a2: number[] = [grid[0][2], grid[1][1], grid[2][0]];
        const a1: number[] = [grid[0][0], grid[1][1], grid[2][2]];

        if (Helper.eval(a1, player) || Helper.eval(a2, player)) {
            return 2;
        } else if (Helper.eval(a1, otherPlayer) || Helper.eval(a2, otherPlayer)) {
            return -1;
        }

        //Unentschieden?
        let occupiedFields: number = 0;
        for (let i: number = 0; i < 3; i++) {
            for (let j: number = 0; j < 3; j++) {
                let value = grid[i][j];
                if (value !== 0) {
                    occupiedFields++;
                }
            }
        }
        if (occupiedFields === 9) {
            return 1;
        }

        return 0;

    }

    public static eval(value: number[], player: number): boolean {
        let countForPlayer: number = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === player) {
                countForPlayer++;
            }
        }
        return countForPlayer === 3;
    }

    public static isNotTaken(field: number[][], i: number, j: number) {
        return field[i][j] === 0;
    }

}