//thecodeplayer.com/walkthrough/html5-game-tutorial-make-a-snake-game-using-html5-canvas-jquery

$(function() {
  //Canvas stuff
  let canvas = $("#canvas")[0];
  let ctx = canvas.getContext("2d");
  let w = $("#canvas").width();
  let h = $("#canvas").height();

  //Lets save the cell width in a variable for easy control
  const cw = 10;
  let d, food, score, snake_array;

  //Lets create the snake now

  function init() {
    d = "right"; //default direction
    create_snake();
    create_food(); //Now we can see the food particle
    //finally lets display the score
    score = 0;

    //Lets move the snake now using a timer which will trigger the paint function
    //every x ms
    if (typeof game_loop != "undefined") clearInterval(game_loop);

    game_loop = setInterval(paint, 80);
  }
  init();

  function create_snake() {
    const length = 10; //Length of the snake
    snake_array = []; //Empty array to start with
    for (let i = length - 1; i >= 0; i--) {
      //This will create a horizontal snake starting from the top left
      snake_array.push({
        x: i,
        y: 0
      });
    }
  }

  //Lets create the food now
  function create_food() {
    food = {
      x: Math.round(Math.random() * (w - cw) / cw),
      y: Math.round(Math.random() * (h - cw) / cw),
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }

  //Lets paint the snake now
  function paint() {
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //The movement code for the snake to come here.
    //The logic is simple
    //Pop out the tail cell and place it infront of the head cell

    let nx = snake_array[0].x;
    let ny = snake_array[0].y;

    let tail = {
      x: nx,
      y: ny
    };

    //These were the position of the head cell.
    //We will increment it to get the new head position
    //Lets add proper direction based movement now
    if (d == "right") nx++;
    if (d == "left") nx--;
    if (d == "up") ny--;
    if (d == "down") ny++;

    //Lets add the game over clauses now
    //This will restart the game if the snake hits the wall
    //Now if the head of the snake bumps into its body, the game will restart
    if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
      //restart game
      init();
      return;
    }

    //Lets write the code to make the snake eat the food
    //The logic is simple
    //If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    if (nx == food.x && ny == food.y) {
      score++;
      //Create new food
      create_food();
    } else {
      tail = snake_array.pop(); //pops out the last cell
      tail.x = nx;
      tail.y = ny;
    }
    //The snake can now eat the food.

    snake_array.unshift(tail); //puts back the tail as the first cell

    snake_array.forEach(ele => paint_cell(ele.x, ele.y));

    //Lets paint the food
    paint_cell(food.x, food.y);
    //Lets paint the score
    let score_text = "Score: " + score;
    ctx.fillText(score_text, 10, h - 10);
  }

  //Lets first create a generic function to paint cells
  function paint_cell(x, y) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
  }

  function check_collision(x, y, array) {
    //check if the provided x/y coordinates exist in an array of cells
    return array.some(ele => ele.x === x && ele.y === y);
  }

  //Lets add the keyboard controls now
  $(document).keydown(function(e) {
    let key = e.which;
    //We will add another clause to prevent reverse gear
    if (key == "37" && d != "right") d = "left";
    if (key == "38" && d != "down") d = "up";
    if (key == "39" && d != "left") d = "right";
    if (key == "40" && d != "up") d = "down";
    //The snake is now keyboard controllable
  })

})