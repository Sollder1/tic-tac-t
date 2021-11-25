import React from 'react';
import './App.css';
import Helper from "./Helper";
import {Ai} from "./Ai";

interface Props {

}

interface State {
    field: number[][],
    stateOut?: string
}

class App extends React.Component<Props, State> {

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
                            return <div className="elm" key={i + "" + j} id={i + "" + j}
                                        onClick={e => this.handleClick(i, j)}>{App.renderInner(inner)}</div>;
                        })
                    }
                </div>
            })}


        </>;
    }

    private handleClick(i: number, j: number) {
        let field = JSON.parse(JSON.stringify(this.state.field));

        try {
            if (!this.state.stateOut && Helper.isNotTaken(field, i, j)) {
                field[i][j] = Helper.P_HU;
                let result: number = Helper.calculateResult(field, Helper.P_HU)
                this.handleResult(result, Helper.P_HU);

                Ai.aiMove(field);
                result = Helper.calculateResult(field, Helper.P_AI);
                this.handleResult(result, Helper.P_AI);
            }
        } catch (e) {
            console.log("Escapeing...");
            this.setState({field: field});
        }

        this.setState({field: field});


    }

    private handleResult(result: number, player: number) {

        if (result === 2) {
            //Handle Win
            this.setState({stateOut: player === Helper.P_HU ? "Mensch gewinnt" : "Maschine gewinnt"})
            throw new Error();
        } else if (result === 1) {
            this.setState({stateOut: "Unentschieden!"})
            throw new Error();
        } else if (result === -1) {
            this.setState({stateOut: player === Helper.P_AI ? "Mensch gewinnt" : "Maschine gewinnt"});
            throw new Error();
        } else {
            return;
        }
    }

    private static renderInner(inner: number) {
        switch (inner) {
            case Helper.P_HU:
                return "x";
            case Helper.P_AI:
                return "o";
            default:
                return "-";
        }
    }

}

export default App;
