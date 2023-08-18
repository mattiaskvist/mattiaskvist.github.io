//snake script inspired by https://www.educative.io/blog/javascript-snake-game-tutorial

const board_border = 'black';
const board_background = 'black';
const snake_col = 'green';
const snake_border = 'darkgreen';
const text_color = 'white';
const food_col = 'red';
const food_border = 'darkred';


let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
];

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;
let food_x;
let food_y;
let score = 0;

// Initialize high score from local storage or set to 0 if not found
let high_score = localStorage.getItem("high_score") || 0;

// Get the canvas element
const canvas = document.getElementById("snakeboard");
// Return a two dimensional drawing context
const snakeboard_ctx = canvas.getContext("2d");
// Start game
main();

gen_food();

// main function called repeatedly to keep the game running
function main() {
    if (has_game_ended()) {
        if (score > high_score) {
            high_score = score;
            localStorage.setItem("high_score", high_score);
            draw_score();
            draw_high_score();
        }
        snakeboard_ctx.font = "16px Arial";
        snakeboard_ctx.fillStyle = text_color;
        // center text based on width of canvas
        snakeboard_ctx.fillText("Game Over", snakeboard.width / 2 - 30, snakeboard.height / 4);
        // play again
        snakeboard_ctx.fillText("Press Enter to Play Again", snakeboard.width / 2 - 80, snakeboard.height / 4 + 20);
        return;
    }

    clearCanvas();
    move_snake();
    draw_food();
    drawSnake();
    draw_score();
    draw_high_score();

}
setInterval(main, 100);

// Draw one snake part
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    snakeboard_ctx.fillStyle = snake_col;
    // Set the border colour of the snake part
    snakeboard_ctx.strokeStyle = snake_border;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Draw the snake on the canvas
function drawSnake() {
    // Draw each part
    snake.forEach(drawSnakePart);
}

// Clear the canvas
function clearCanvas() {
    //  Select the colour to fill the drawing
    snakeboard_ctx.fillStyle = board_background;
    //  Select the colour for the border of the canvas
    snakeboard_ctx.strokeStyle = board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    // Draw a "border" around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// move snake
function move_snake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
        score++;
        gen_food();
    } else {
        // Remove the last part of snake body
        snake.pop();
    }

}

function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
    food_x = random_food(0, snakeboard.width - 10);
    food_y = random_food(0, snakeboard.height - 10);
}

function draw_food() {
    snakeboard_ctx.fillStyle = food_col;
    snakeboard_ctx.strokeStyle = food_border;

    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function draw_score() {
    snakeboard_ctx.font = "16px Arial";
    snakeboard_ctx.fillStyle = text_color;
    snakeboard_ctx.fillText(`Score: ${score}`, 8, 20)
}

function draw_high_score() {
    snakeboard_ctx.font = "16px Arial";
    snakeboard_ctx.fillStyle = text_color;
    snakeboard_ctx.fillText(`High Score: ${high_score}`, 8, 40)
}

//--------------------------------------------
// Controls

// Keyboard controls
document.addEventListener("keydown", keyDownHandler, false);

// keydown handler
// snake can't go in opposite direction of current direction
function keyDownHandler(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (dx == 10) return;
            dx = -10;
            dy = 0;
            break;
        case "ArrowRight":
            if (dx == -10) return;
            dx = 10;
            dy = 0;
            break;
        case "ArrowUp":
            if (dy == 10) return;
            dx = 0;
            dy = -10;
            break;
        case "ArrowDown":
            if (dy == -10) return;
            dx = 0;
            dy = 10;
            break;
        case "Enter":
            if (has_game_ended()) {
                location.reload();
            }
            break;
    }
}

// Touch controls
canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);

let touch_start_x = null;
let touch_start_y = null;

function touchStartHandler(event) {
    if (event.touches){
        event.preventDefault();
    }
    if (has_game_ended()) {
        location.reload();
    }
    touch_start_x = event.touches[0].clientX;
    touch_start_y = event.touches[0].clientY;
} 

function touchMoveHandler(event) {
    if (event.touches){
        event.preventDefault();
    }
    if (!touch_start_x || !touch_start_y) {
        return;
    }
    if (has_game_ended()) {
        location.reload();
    }
    let touch_end_x = event.touches[0].clientX;
    let touch_end_y = event.touches[0].clientY;

    let touch_dx = touch_end_x - touch_start_x;
    let touch_dy = touch_end_y - touch_start_y;

    if (Math.abs(touch_dx) > Math.abs(touch_dy)) {
        if (touch_dx> 0) {
            // right swipe
            if (dx == -10) return;
            dx = 10;
            dy = 0;
        } else {
            // left swipe
            if (dx == 10) return;
            dx = -10;
            dy = 0;
        }
    } else {
        if (touch_dy > 0) {
            // down swipe
            if (dy == -10) return;
            dx = 0;
            dy = 10;
        } else {
            // up swipe
            if (dy == 10) return;
            dx = 0;
            dy = -10;
        }
    }

    touch_start_x = null;
    touch_start_y = null;
}
