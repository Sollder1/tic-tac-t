//default settings
let randomized: boolean = true
let AI_begins:boolean = true




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


export class Node {
    grid: number[]
    player: number
    move: number
    winner: number
    children: Node[] = []



    constructor(grid: number[], player:number, move:number, winner:number, children: Node[]) {
        this.grid = grid
        this.player = player
        this.move = move
        this.winner = winner
        this.children = children
    }


////////////////////////////////////////////////////////////////////////// helper functions


    public static toLinearArray(grid: number[][]): number[] {
        return [grid[0][0], grid[0][1], grid[0][2], grid[1][0], grid[1][1], grid[1][2], grid[2][0], grid[2][1], grid[2][2]];
    }


    public static to2DArray(grid: number[]): number[][] {
        return [[grid[0], grid[1], grid[2]], [grid[3], grid[4], grid[5]], [grid[6], grid[7], grid[8]]]
    }


    public has_won(grid: number[]): number {
        let evaluation: number[] = [(grid[0] + grid[1] + grid[2]), (grid[3] + grid[4] + grid[5]), (grid[6] + grid[7] + grid[8]),
            (grid[0] + grid[3] + grid[6]), (grid[1] + grid[4] + grid[7]), (grid[2] + grid[5] + grid[8]),
            (grid[0] + grid[4] + grid[8]), (grid[6] + grid[4] + grid[2])]
        for (let i: number = 0; i < grid.length; i++) {
            if (grid[i] === -3) {
                return -1}
            else if (grid[i] === 3) {
                return 1}
            return 0
        }
    }


    public build_Node(grid: number[], player: number, i: number): Node {
        let new_grid:number[] = JSON.parse(JSON.stringify(grid))
        new_grid[i] = player
        return new Node(this.grid = new_grid, this.player = -player, this.move = i, this.winner = this.has_won(new_grid), this.children = [])
    }


////////////////////////////////////////////////////////////////////////// AI logic


    public build_tree() {
        if (this.winner === 0) {
            for (const i in [0,1,2,3,4,5,6,7,8]) {
                if (this.grid[i] === 0) {       //only continues the tree if game is not finished
                    this.children.push(this.build_Node(this.grid, this.player, i))
                }
            }
            let children_winner:number[] = [-2]     //evaluation
            for (let i = 0; i < this.children.length; i++){
                this.children[i].build_tree()
                children_winner.push(this.children[i].winner * this.player)        //evaluation
                this.winner = Math.max(...children_winner) * this.player   //evaluation
            }
        }
        else {return}
    }


    public node_search(): number[][] {
        let value:number = -2
        let current_child:number = 0
        for (let i = 0; i < this.children.length; i++){
            if (randomized) {
                if ((this.children[i].winner > value) || ((this.children[i].winner === value) && (Math.random() > 0.66 ))) {
                    value = this.children[i].winner
                    current_child = i
                }
            }
            else {
                if (this.children[i].winner > value) {
                    value = this.children[i].winner
                    current_child = i
                }
            }
        }
        return Node.to2DArray(this.children[current_child].grid)
    }


////////////////////////////////////////////////////////////////////////// IO


    public user_move_mover(wrong_grid: number[][]) {
        let grid:number[] = Node.toLinearArray(wrong_grid)
        for (let i = 0; i < this.children.length; i++){
            if (this.children[i].grid === grid) {
                if (this.children[i].children === []) {
                    return Node.to2DArray(this.children[i].grid)
                }
            }
            else {
                this.children[i].node_search()
            }
        }
    }
}







/*


////////////////////////////////////////////////////////////////////////// main


if AI_begins:
    root = Node([0,0,0,0,0,0,0,0,0], 1, 0, 0) //Node with empty grid
    root.build_tree()   //builds tree on empty grid
else:
    root = Node([0,0,0,0,0,0,0,0,0], -1, 0, 0) //Node with empty grid
    root.build_tree()   //builds tree on empty grid


def main():
    print()
    print()
    print()
    print("Return the number at which grid position your X shall be")
    print("1","|","2","|","3") //original farmat
    print("4","|","5","|","6")
    print("7","|","8","|","9")
    print()
    if AI_begins:
        if randomized:      //AI evaluates every first movve as 0, so we can randomize
            (root.children[random.randint(0, 8)]).input_output()  //randomized version
        else:
            (root.children[4]).input_output()                    //persistent version
    else:
        root.input_output()

    //for c in root.children:        //debugging
    //    print ("1.", c.grid, c.player, c.move, c.winner)
    //    for i in c.children:
    //        print("2.", i.grid, i.player,i.move, i.winner)
    //        for j in i.children:
    //            print("3.", j.grid, j.player, j.move, j.winner)
    //            for k in j.children:
    //                print("4.", k.grid, k.player, k.move, k.winner)



if __name__ == "__main__":
    main()

*/