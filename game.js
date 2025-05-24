// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;
const CANVAS_SIZE = 400;

// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop;
let gameOver = false;

// Initialize the game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Initialize snake
    snake = [
        {x: 6, y: 10},
        {x: 5, y: 10},
        {x: 4, y: 10}
    ];
    
    // Initialize food
    generateFood();
    
    // Reset game state
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    
    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, GAME_SPEED);
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
    };
    
    // Make sure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
        };
    }
}

// Update game state
function update() {
    if (gameOver) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = {x: snake[0].x, y: snake[0].y};
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check for collisions
    if (isCollision(head)) {
        endGame();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    // Draw everything
    draw();
}

// Check for collisions
function isCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head with a slightly different color
            ctx.fillStyle = '#66BB6A';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );
    });
    
    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
        food.x * GRID_SIZE,
        food.y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
    );
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// End game
function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Restart game
function restartGame() {
    initGame();
}

// Start the game when the page loads
window.onload = initGame; 