
const player = document.getElementById('player');
const deudor = document.getElementById('deudor');
const gameArea = document.getElementById('game-area');
const mensaje = document.getElementById('mensaje');

let playerPosition = { x: 100, y: 100 };
let deudorPosition = { x: 300, y: 300 };

let playerSpeed = 3;
let deudorSpeed = 1;

const keys = {};
let gameOver = false;

// obstaculos: facturas
const obstacles = [
    { x: 200, y: 100, w: 30, h: 150 },
    { x: 100, y: 310, w: 150, h: 30 },
    { x: 350, y: 150, w: 100, h: 30 },
    { x: 370, y: 300, w: 30, h: 130 }
];

// crear obstaculos
obstacles.forEach((o) => {
    const div = document.createElement('div');

    div.className = 'obstaculo';
    div.style.left = o.x + 'px';
    div.style.top = o.y + 'px';
    div.style.width = o.w + 'px';
    div.style.height = o.h + 'px';

    gameArea.appendChild(div);
});

// detectar colisiones
function hitsObstacle(x, y) {
    return obstacles.some((o) =>
        x < o.x + o.w && x + 50 > o.x &&
        y < o.y + o.h && y + 50 > o.y
    );
}

// controles del teclado
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

window.addEventListener('blur', () => {
    for (const k in keys) {
        keys[k] = false;
    }
});

// movimiento del SAT
function movePlayer() {
    if (gameOver) return;

    // movimiento horizontal
    const xAnterior = playerPosition.x;

    if (keys['ArrowLeft']) playerPosition.x -= playerSpeed;
    if (keys['ArrowRight']) playerPosition.x += playerSpeed;

    playerPosition.x = Math.max(0, Math.min(
        playerPosition.x, gameArea.clientWidth - 50
    ));

    if (hitsObstacle(playerPosition.x, playerPosition.y)) {
        playerPosition.x = xAnterior;
    }

    // movimiento vertical
    const yAnterior = playerPosition.y;

    if (keys['ArrowUp']) playerPosition.y -= playerSpeed;
    if (keys['ArrowDown']) playerPosition.y += playerSpeed;

    playerPosition.y = Math.max(0, Math.min(
        playerPosition.y, gameArea.clientHeight - 50
    ));

    if (hitsObstacle(playerPosition.x, playerPosition.y)) {
        playerPosition.y = yAnterior;
    }
}

// movimiento del deudor
function moveDeudor() {
    if (gameOver) return;

    const antes = { x: deudorPosition.x, y: deudorPosition.y };

    // perseguir en X
    if (deudorPosition.x < playerPosition.x) {
        deudorPosition.x += deudorSpeed;
    } else if (deudorPosition.x > playerPosition.x) {
        deudorPosition.x -= deudorSpeed;
    }

    if (hitsObstacle(deudorPosition.x, deudorPosition.y)) {
        deudorPosition.x = antes.x;
    }

    // perseguir en Y
    if (deudorPosition.y < playerPosition.y) {
        deudorPosition.y += deudorSpeed;
    } else if (deudorPosition.y > playerPosition.y) {
        deudorPosition.y -= deudorSpeed;
    }

    if (hitsObstacle(deudorPosition.x, deudorPosition.y)) {
        deudorPosition.y = antes.y;
    }

    updatePosition();
    checkCollision();
}

// actualizar posiciones
function updatePosition() {
    player.style.transform =
        `translate(${playerPosition.x}px, ${playerPosition.y}px)`;

    deudor.style.transform =
        `translate(${deudorPosition.x}px, ${deudorPosition.y}px)`;
}

// detectar si el SAT alcanza al deudor
function checkCollision() {
    if (
        Math.abs(playerPosition.x - deudorPosition.x) < 50 &&
        Math.abs(playerPosition.y - deudorPosition.y) < 50
    ) {
        gameOver = true;
        mensaje.classList.remove('oculto');
    }
}

// bucle principal
function gameLoop() {
    movePlayer();
    moveDeudor();

    requestAnimationFrame(gameLoop);
}

updatePosition();
gameLoop();

// reiniciar partida
document.getElementById('reintentar').addEventListener('click', () => {
    playerPosition = { x: 100, y: 100 };
    deudorPosition = { x: 300, y: 300 };

    gameOver = false;
    mensaje.classList.add('oculto');

    updatePosition();
});

// velocidad del SAT
document.getElementById('playerSpeedInput').addEventListener('input', (e) => {
    playerSpeed = Number(e.target.value);

    document.getElementById('playerSpeedValue').textContent = playerSpeed;
});

// velocidad del deudor
document.getElementById('deudorSpeedInput').addEventListener('input', (e) => {
    deudorSpeed = Number(e.target.value);

    document.getElementById('deudorSpeedValue').textContent = deudorSpeed;
});

// cambiar color de fondo
document.getElementById('bgColorInput').addEventListener('input', (e) => {
    gameArea.style.backgroundColor = e.target.value;
});

// musica
const music = document.getElementById('music');
music.volume = 0.5;

document.getElementById('musicToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        music.play();
    } else {
        music.pause();
    }
});

// volumen
document.getElementById('volumeInput').addEventListener('input', (e) => {
    music.volume = Number(e.target.value) / 100;

    document.getElementById('volumeValue').textContent = e.target.value;
});
