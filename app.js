const maze = document.querySelector(".maze");
const ctx = maze.getContext("2d");
const svgNS = "http://www.w3.org/2000/svg";

let current;

class Maze{
    constructor(size, rows, cols){
        this.size = size;
        this.rows = rows;
        this.cols = cols;

        this.grid = [];
        this.stack = [];
    }

    setup(){
        for(let r = 0; r < this.rows; r++){
            const thisRow = [];
            for(let c = 0; c < this.cols; c++){
                const cell = new Cell(r, c, this.grid, this.size);
                thisRow.push(cell);
            }
            this.grid.push(thisRow);
        }
        current = this.grid[0][0];
    }

    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        current.visited = true;

        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                const grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.cols);
            }
        }

        const next = current.checkNeighbours();

        if(next){
            next.visited = true;
            
            this.stack.push(current);

            current.highlight(this.cols);

            current.removeWall(current, next);

            current = next;
        }else if(this.stack.length > 0){
            const cell = this.stack.pop();
            current = cell;
            current.highlight(this.cols);
        }

        if(this.stack.length == 0){
            // End of generation;
            this.cellSize = (this.size / this.grid.length);

            this.control = document.querySelector(".control");
            this.control.setAttribute("width", this.size);
            this.control.setAttribute("height", this.size);

            const player = document.createElementNS(svgNS, "circle");
            player.setAttribute("r", (this.cellSize / 2) - 2);
            player.setAttribute("cx", this.cellSize / 2);
            player.setAttribute("cy", this.cellSize / 2);
            player.setAttribute("fill", "red");

            this.player = player

            this.position = [0, 0];

            this.playerCell = this.grid[0][0]
            
            this.control.appendChild(player);

            document.body.addEventListener("keydown",(event)=>{
                if(["w","s","a","d"].includes(event.key)){
                    this.move(this.position[0], this.position[1], event.key)
                }
            })
            return;
        }

        window.requestAnimationFrame(()=>{
            this.draw();
        })
    }

    move(x, y, dir){
        if(dir == "s"){
            // down
            if(!this.playerCell.walls.bottom && y + 1 < this.grid.length){
                // move
                this.playerCell = this.grid[y + 1][x];
                this.position = [x, y + 1]
                this.player.setAttribute("cy", (y + 1) * this.cellSize + (this.cellSize / 2))
            }else{
                // DONT MOVE!
                console.log("CANT MOVE")
            }
        }else if(dir == "d"){
            // right
            if(!this.playerCell.walls.right && x + 1 < this.grid.length){
                // move
                this.playerCell = this.grid[y][x + 1];
                this.position = [x + 1, y];
                this.player.setAttribute("cx", (x + 1) * this.cellSize + (this.cellSize / 2));
            }else{
                // DONT MOVE
                console.log("CANT MOVE")
            }
        }else if(dir == "w"){
            // up
            if(!this.playerCell.walls.top && y - 1 >= 0){
                // move
                this.playerCell = this.grid[y - 1][x];
                this.position = [x, y - 1];
                this.player.setAttribute("cy", (y - 1) * this.cellSize + (this.cellSize / 2))
            }else{
                // DONT MOVE
                console.log("CANT MOVE")
            }
        }else if(dir == "a"){
            // left
            if(!this.playerCell.walls.left && x - 1 >= 0){
                // move
                this.playerCell = this.grid[y][x - 1];
                this.position = [x - 1, y];
                this.player.setAttribute("cx", (x - 1) * this.cellSize + (this.cellSize / 2))
            }
        }
    }
}

class Cell{
    constructor(rowNum, colNum, parentGrid, parentSize){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            top:true,
            left:true,
            right:true,
            bottom:true
        }
    }

    checkNeighbours(){
        const grid = this.parentGrid;
        const row = this.rowNum;
        const col = this.colNum;
        const neighbours = [];

        const top = row !== 0 ? grid[row - 1][col] : undefined;
        const right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        const left = col !== 0 ? grid[row][col - 1] : undefined;
        const bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;

        if(top && !top.visited){neighbours.push(top)}
        if(right && !right.visited){neighbours.push(right)}
        if(left && !left.visited){neighbours.push(left)}
        if(bottom && !bottom.visited){neighbours.push(bottom)}

        if(neighbours.length != 0){
            const random = Math.floor(Math.random()*neighbours.length);
            return neighbours[random];
        }else{
            return undefined;
        }
    }

    drawTopWall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/columns, y);
        ctx.stroke();
    }
    drawRightWall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x+size/columns, y);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }
    drawBottomWall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y+size/rows);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }
    drawLeftWall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+size/rows);
        ctx.stroke();
    }

    removeWall(cell1, cell2){
        const x = cell1.colNum - cell2.colNum;

        if(x == 1){
            cell1.walls.left = false;
            cell2.walls.right = false;
        }else if(x == -1){
            cell2.walls.left = false;
            cell1.walls.right = false;
        }

        const y = cell1.rowNum - cell2.rowNum;

        if(y == 1){
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        }else if(y == -1){
            cell2.walls.top = false;
            cell1.walls.bottom = false;
        }
    }

    highlight(columns){
        const x = (this.colNum * this.parentSize) / columns + 1
        const y = (this.rowNum * this.parentSize) / columns + 1

        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    }

    show(size, rows, columns){
        const x = (this.colNum * size) / columns;
        const y = (this.rowNum * size) / rows;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2

        if(this.walls.top){
            this.drawTopWall(x, y, size, columns, rows);
        }
        if(this.walls.left){
            this.drawLeftWall(x, y, size, columns, rows);
        }
        if(this.walls.bottom){
            this.drawBottomWall(x, y, size, columns, rows);
        }
        if(this.walls.right){
            this.drawRightWall(x, y, size, columns, rows);
        }
        if(this.visited){
            ctx.fillRect(x+1, y+1, size/columns - 2, size/rows - 2);
        }
    }


}

let newMaze = new Maze(1000, 20, 20);
newMaze.setup();
newMaze.draw();