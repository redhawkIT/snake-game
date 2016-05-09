//thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery

$(function() {
  // fix bottom and right bounds
    const KEYS = {left: 37, up: 38, right: 39, down: 40};

    //Canvas stuff
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth - 20;
    let h = canvas.height = window.innerHeight - 20;
    
    const cellSize = Math.round(w / 60);
    let d, food, score, snakeArray;

    //create the snake
    function init() {
        d = "right"; //default direction
        createSnake();
        createFood();
        score = 10;
        // resets so that multiple instances are not created
        if (typeof gameLoop != "undefined") clearInterval(gameLoop);

        gameLoop = setInterval(paint, 85);
    }
    init();

    function createSnake() {
        const length = 10; //Length of the snake
        snakeArray = []; 

        for (let i = length - 1; i >= 0; i--) {
            snakeArray.push({
                x: i,
                y: 0
            });
        }
    }

    //Lets create the food now
    function createFood() {
        food = {
            x: Math.round(Math.random() * (w - cellSize) / cellSize),
            y: Math.round(Math.random() * (h - cellSize) / cellSize),
        };
    }

    //paint the snake
    function paint() {
        //To avoid the snake trail we need to paint the BG on every frame
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);

        //Pop out the tail cell and place it infront of the head cell
        let nx = snakeArray[0].x;
        let ny = snakeArray[0].y;

        let tail = {
            x: nx,
            y: ny
        };

        //These were the position of the head cell.
        //We will increment it to get the new head position
        if (d == "right") nx++;
        if (d == "left") nx--;
        if (d == "up") ny--;
        if (d == "down") ny++;

        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Now if the head of the snake bumps into its body, the game will restart
        if (nx == -1 || nx > w / cellSize || ny == -1 || ny > h / cellSize || checkCollision(nx, ny, snakeArray)) {
            init(); //restart game
            return;
        }

        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if (nx == food.x && ny == food.y) {
            score++;
            createFood();
        } else {
            tail = snakeArray.pop(); //pops out the last cell
            tail.x = nx;
            tail.y = ny;
        }

        snakeArray.unshift(tail); //puts back the tail as the first cell

        snakeArray.forEach(ele => paintCell(ele.x, ele.y));

        paintCell(food.x, food.y); // paint the food
        ctx.fillText(`Length ${score}`, 14, h - 14); // paint the score
    }

    //Lets first create a generic function to paint cells
    function paintCell(x, y) {
        ctx.fillStyle = '#00FFFF';
        //ctx.arc(x * cellSize, y * cellSize, cellSize / 2, 0, 2 * Math.PI);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

    }

    function checkCollision(x, y, array) {
        //check if the provided x/y coordinates exist in an array of cells
        return array.some(ele => ele.x === x && ele.y === y);
    }

    //Lets add the keyboard controls now
    document.addEventListener("keydown", e => {
        // add another clause to prevent reverse gear
        if (KEYS.left === e.keyCode && d != "right") d = "left";
        if (KEYS.up === e.keyCode && d != "down") d = "up";
        if (KEYS.right === e.keyCode && d != "left") d = "right";
        if (KEYS.down === e.keyCode && d != "up") d = "down";
    });
});