const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 8;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 5;
const AI_SPEED = 4;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 4 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1),
    radius: BALL_RADIUS
};
let playerScore = 0, aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color="#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}
function drawText(text, x, y, color="#fff") {
    ctx.fillStyle = color;
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Collision detection
function collision(paddleX, paddleY, paddleW, paddleH, ball) {
    return (
        ball.x + ball.radius > paddleX &&
        ball.x - ball.radius < paddleX + paddleW &&
        ball.y + ball.radius > paddleY &&
        ball.y - ball.radius < paddleY + paddleH
    );
}

// Main update loop
function update() {
    // Move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Ball collision with player paddle
    if (collision(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, ball)) {
        ball.vx = -ball.vx;
        // Add some "spin"
        const collidePoint = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += collidePoint * 2;
        ball.x = PLAYER_X + PADDLE_WIDTH + ball.radius; // avoid sticking
    }

    // Ball collision with AI paddle
    if (collision(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, ball)) {
        ball.vx = -ball.vx;
        // Add some "spin"
        const collidePoint = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += collidePoint * 2;
        ball.x = AI_X - ball.radius; // avoid sticking
    }

    // Point scored
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI: track ball's y position
    if (aiY + PADDLE_HEIGHT / 2 < ball.y) {
        aiY += AI_SPEED;
    } else if (aiY + PADDLE_HEIGHT / 2 > ball.y) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Render everything
function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");
    // Draw net
    for (let i = 5; i < canvas.height; i += 20) {
        drawRect(canvas.width/2 - 1, i, 2, 10, "#333");
    }
    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius);
    // Draw scores
    drawText(playerScore, canvas.width/4, 40);
    drawText(aiScore, 3 * canvas.width/4, 40);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start the game
gameLoop();