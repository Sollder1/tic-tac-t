/*  Node formt: explanation

grid format: filled with -1 or 1 if 
       0 | 1 | 2
       3 | 4 | 5
       6 | 7 | 8
   example: grid = [0, -1, 0, 1, 1, 0, -1, 0, 0]

player: the player how made the move that lead to this position
   AI = 1 = "O" , user = -1 = "X"

move:  the move that lead to this position (given as the grid position)

winner:
for leafs: return from has_won function
   0 or -1 or 1     
*/


////////////////////////////////////////////////////////////////////////// Node Class


export class AI_Node {
    grid: number[]
    player: number
    move: number
    winner: number
    children: AI_Node[] = []


    constructor(grid: number[], player: number, move:number, winner: number, children: AI_Node[]) {
        this.grid = grid
        this.player = player
        this.move = move
        this.winner = winner
        this.children = children
    }


////////////////////////////////////////////////////////////////////////// helper functions


    public static toLinearArray(grid: number[][]): number[] {
        let transform = [grid[0][0], grid[0][1], grid[0][2], grid[1][0], grid[1][1], grid[1][2], grid[2][0], grid[2][1], grid[2][2]];
        for (let i: number = 0; i < 9; i++) {
            if (transform[i] === 2) {
                transform[i] = -1
            }
        }
        return transform
    }



    public has_won(grid: number[]): number {
        let evaluation: number[] = [(grid[0] + grid[1] + grid[2]), (grid[3] + grid[4] + grid[5]), (grid[6] + grid[7] + grid[8]),
            (grid[0] + grid[3] + grid[6]), (grid[1] + grid[4] + grid[7]), (grid[2] + grid[5] + grid[8]),
            (grid[0] + grid[4] + grid[8]), (grid[6] + grid[4] + grid[2])]
        for (let i: number = 0; i < evaluation.length; i++) {
            if (evaluation[i] === -3) {
                return -1
            } else if (evaluation[i] === 3) {
                return 1
            } else {
                return 0
            }
        }
        throw new Error ("this error makes no sense")
    }


    public build_Node(grid: number[], player: number, i: number): AI_Node {
        let new_grid: number[] = JSON.parse(JSON.stringify(grid))
        new_grid[i] = player
        return new AI_Node(new_grid, -player, i, this.has_won(new_grid), [])
    }


////////////////////////////////////////////////////////////////////////// AI logic


    public build_tree() {
        if (this.winner === 0) {
            for (let i: number = 0; i < 9; i++) {
                if (this.grid[i] === 0) {       //only continues the tree if game is not finished
                    this.children.push(this.build_Node(this.grid, this.player, i))
                }
            }
            let children_winner: number[] = []     //evaluation
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].build_tree()
                children_winner.push(this.children[i].winner * this.player)        //evaluation
                if (children_winner != []) {
                    this.winner = Math.max(...children_winner) * this.player   //evaluation
                }
            }
        } else {
            return
        }
    }


    public node_search(randomized: boolean): number{
        let value: number = -2
        let current_child: number = 0
        for (let i = 0; i < this.children.length; i++) {
            if (randomized) {
                if ((this.children[i].winner > value) || ((this.children[i].winner === value) && (Math.random() > 0.66))) {
                    value = this.children[i].winner
                    current_child = i
                }
            } else {
                if (this.children[i].winner > value) {
                    value = this.children[i].winner
                    current_child = i
                }
            }
        }
        return this.children[current_child].move
    }



    public static calc_move(grid: number[][], randomized: boolean) {
        let current_Node = new AI_Node(AI_Node.toLinearArray(grid), 1, 0, 0, [])
        current_Node.build_tree()
        console.log(current_Node.children)
        return current_Node.node_search(randomized)
    }

}

