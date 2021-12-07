import React from 'react';
import './App.css';
import Helper from "./Helper";
import {Ai} from "./Ai";
import {AppBar, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select,} from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import Checkbox from '@mui/material/Checkbox';

interface Props {

}

interface State {
    field: number[][],
    stateOut?: string,
    gameStillRunning: boolean,
    algorithm: number,
    randomOnDraw: boolean
}

class App extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            field: [[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]],
            stateOut: "Spiel läuft noch",
            gameStillRunning: true,
            algorithm: 3,
            randomOnDraw: true
        };
    }

    render() {
        return <>

            <AppBar position="relative" className="header" color="transparent">
                <h1 style={{textAlign: "center", fontSize: "40px"}}>Tic-Tac-Toe</h1>
            </AppBar>

            <Grid container spacing={2} style={{marginTop: "20px"}}>

                <Grid item xl={4.5} lg={5.0} md={6} sm={5.5} xs={12}>
                    <Paper elevation={5} style={{padding: "20px"}}>
                        {this.renderGameGrid()}
                    </Paper>
                </Grid>
                <Grid item xl={0.5} lg={0.5} md={0.3} sm={0.5} xs={0}>
                </Grid>
                <Grid item xl={7} lg={6.5} md={5.7} sm={6} xs={12}>
                    <Paper elevation={5} style={{padding: "20px"}}>
                        <h2 className="head">
                            {this.state.stateOut}
                            {!this.state.gameStillRunning ? <Button style={{marginLeft: "10px"}} variant="contained"
                                                                    onClick={ev => this.handleRestart()}><ReplayIcon/></Button> : null}
                        </h2>

                        <h2 style={{marginTop: "50px"}}>Einstellungen</h2>
                        <FormControl fullWidth>
                            <InputLabel>Algorithmus</InputLabel>
                            <Select
                                value={this.state.algorithm}
                                label="Algorithmus"
                                onChange={val => this.setState({algorithm: val.target.value as number})}
                            >
                                <MenuItem value={1}>Zufallsbasiert</MenuItem>
                                <MenuItem value={2}>Sollder1 Baumsuche</MenuItem>
                                <MenuItem value={3}>Manstein Baumsuche</MenuItem>
                            </Select>
                        </FormControl>


                        <FormControlLabel
                            label="Zufällige Auswahl bei gleichen Zügen"
                            control={<Checkbox
                                checked={this.state.randomOnDraw}
                                onChange={val => this.setState({randomOnDraw: val.target.checked})}
                            />}
                            style={{padding: "10px"}}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>;
    }

    private renderGameGrid() {
        return <>
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
            if (this.state.gameStillRunning && Helper.isNotTaken(field, i, j)) {
                field[i][j] = Helper.P_HU;
                let result: number = Helper.calculateResult(field, Helper.P_HU)
                this.handleResult(result, Helper.P_HU);

                Ai.aiMove(field, this.state.algorithm, this.state.randomOnDraw);
                result = Helper.calculateResult(field, Helper.P_AI);
                this.handleResult(result, Helper.P_AI);
            }
        } catch (e) {
            console.log("Game is ending...");
            this.setState({field: field, gameStillRunning: false});
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
                return "";
        }
    }

    private handleRestart() {
        this.setState({
            field: [[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]],
            stateOut: "Spiel läuft noch",
            gameStillRunning: true
        })
    }
}

export default App;
