import React from 'react';
import './App.css';


interface Props {

}

interface State {
    field: number[][],
    stateOut?: string
}

class App extends React.Component<Props, State> {

    private static P_HU = 1;
    private static P_AI = 2;


    public constructor(props: Props) {
        super(props);
        this.state = {
            field: [[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]]
        };
    }

    render() {
        return <>
            <h1 className="head">Tic-Tac-Toe</h1>
            <h2 className="head">{this.state.stateOut}</h2>
            {this.state.field.map((value, i) => {
                return <div className="row-grid">
                    {
                        value.map((inner, j) => {
                            return <div className="elm"
                                        onClick={e => this.handleClick(i, j)}>{App.renderInner(inner)}</div>;
                        })
                    }
                </div>
            })}


        </>;
    }

    private handleClick(i: number, j: number) {
        try {
            if (!this.state.stateOut && this.isNotTaken(i, j)) {
                this.state.field[i][j] = App.P_HU;
                this.setState({field: this.state.field});
                let result: number = this.calculateResult(App.P_HU)
                this.handleResult(result, App.P_HU);

                this.aiMove();

                result = this.calculateResult(App.P_AI)
                this.handleResult(result, App.P_AI);
            }
        } catch (e) {
            console.log("Escapeing...")
        }
    }

    private handleResult(result: number, player: number){

        if (result === 2) {
            //Handle Win
            this.setState({stateOut: player === App.P_HU ? "Mensch gewinnt" : "Maschine gewinnt"})
            throw new Error();
        } else if (result === 1) {
            this.setState({stateOut: "Unentschieden!"})
            throw new Error();
        } else if (result === -1) {
            this.setState({stateOut: player === App.P_AI ? "Mensch gewinnt" : "Maschine gewinnt"});
            throw new Error();
        } else {
            return;
        }

    }

    private static renderInner(inner: number) {
        switch (inner) {
            case App.P_HU:
                return "x";
            case App.P_AI:
                return "o";
            default:
                return "-";
        }
    }

    private aiMove() {
        let moved = false;
        while (!moved) {
            let i = Math.floor(Math.random() * 3);
            let j = Math.floor(Math.random() * 3);
            if (this.isNotTaken(i, j)) {
                this.state.field[i][j] = App.P_AI;
                moved = true;
            }
        }
        this.setState({field: this.state.field});
    }


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

    private calculateResult(player: number) {

        const grid = this.state.field;
        const otherPlayer = player === App.P_AI ? App.P_HU : App.P_AI;


        //Gewonnen und wenn ja, wer?
        for (let i: number = 0; i < 2; i++) {
            const evalVertical: number[] = [grid[i][0], grid[i][1], grid[i][2]];
            const evalHorizontal: number[] = [grid[0][i], grid[1][i], grid[2][i]];

            if (this.eval(evalHorizontal, player) || this.eval(evalVertical, player)) {
                return 2;
            } else if (this.eval(evalHorizontal, otherPlayer) || this.eval(evalVertical, otherPlayer)) {
                return -1;
            }
        }

        const a2: number[] = [grid[0][2], grid[1][1], grid[2][0]];
        const a1: number[] = [grid[0][0], grid[1][1], grid[2][2]];

        if (this.eval(a1, player) || this.eval(a2, player)) {
            return 2;
        } else if (this.eval(a1, otherPlayer) || this.eval(a2, otherPlayer)) {
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


    private eval(value: number[], player: number): boolean {
        let countForPlayer: number = 0;
        for (let i = 0; i < value.length; i++) {
            if(value[i] === player) {
                countForPlayer++;
            }
        }
        return countForPlayer === 3;
    }

    private isNotTaken(i: number, j: number) {
        return this.state.field[i][j] === 0;
    }
}

export default App;
