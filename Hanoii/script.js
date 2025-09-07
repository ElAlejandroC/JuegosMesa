// =============================
// TORRES DE HANOI
// =============================

// Estado del juego
let gameState = {};

// Navegación
function goToMenu() {
    stopTimer();
    clearHighlight();
    navigateToMenu();
}

// Funciones de navegación
function navigateToMenu() {
    window.location.href = 'menu.html';
}

// Inicializar juego
function initHanoiGame(diskCount = 4) {
    // Validar rango de dificultad
    if (diskCount < 3) diskCount = 3;
    if (diskCount > 8) diskCount = 8;

    const minMoves = Math.pow(2, diskCount) - 1;

    gameState = {
        towers: [[], [], []],
        selectedTower: null,
        moves: 0,
        startTime: Date.now(),
        gameTime: 0,
        timerInterval: null,
        diskCount,
        minMoves
    };

    // Inicializar discos en la primera torre
    for (let i = diskCount; i >= 1; i--) {
        gameState.towers[0].push(i);
    }

    updateDisplay();
    startTimer();

    // Actualizar máximo de movimientos en UI
    document.getElementById('maxMoves').textContent = minMoves;
}

// =============================
// DISPLAY
// =============================
function updateDisplay() {
    const towers = document.querySelectorAll('.tower');
    towers.forEach(tower => {
        tower.innerHTML = '';

        // Línea de guía
        const line = document.createElement('div');
        line.style.cssText = `
            position: absolute;
            bottom: 0;
            width: 2px;
            height: 200px;
            background: rgba(255, 255, 255, 0.5);
            left: 50%;
            transform: translateX(-50%);
        `;
        tower.appendChild(line);
    });

    // Dibujar discos
    gameState.towers.forEach((tower, towerIndex) => {
        const towerElement = towers[towerIndex];
        const towerWidth = towerElement.clientWidth;    
        const maxDiskWidth = towerWidth * 0.9; // 90% del ancho disponible
        const minDiskWidth = towerWidth * 0.3; // el más pequeño será 30%

        const step = (maxDiskWidth - minDiskWidth) / (gameState.diskCount - 1);

        // Altura dinámica de la línea guía
        const line = towerElement.querySelector('div');
        if (line) {
            const towerHeight = gameState.diskCount * 25 + 50; // escalar según discos
            line.style.height = towerHeight + 'px';
        }

        tower.forEach((diskSize, diskIndex) => {
            const disk = document.createElement('div');
            disk.className = 'disk';
        
            // Ancho proporcional y escalado al contenedor
            disk.style.width = (minDiskWidth + step * (diskSize - 1)) + 'px';
            disk.style.height = '20px';
            disk.style.margin = '2px auto';
        
            // Color cíclico
            const hue = (diskSize * 45) % 360;
            disk.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        
            disk.onclick = () => selectDisk(towerIndex, diskIndex);
            towerElement.appendChild(disk);
        });
    });


    // Actualizar stats
    document.getElementById('movesCount').textContent = gameState.moves;
    const affinity = Math.max(
        0,
        Math.round((gameState.minMoves / Math.max(gameState.moves, 1)) * 100)
    );
    document.getElementById('affinity').textContent = affinity + '%';
}

// =============================
// LÓGICA DEL JUEGO
// =============================
function selectTower(towerIndex) {
    if (gameState.selectedTower === null) {
        if (gameState.towers[towerIndex].length > 0) {
            gameState.selectedTower = towerIndex;
            highlightSelectedTower(towerIndex);
        }
    } else {
        moveDisk(gameState.selectedTower, towerIndex);
        gameState.selectedTower = null;
        clearHighlight();
    }
}

function selectDisk(towerIndex, diskIndex) {
    if (diskIndex === gameState.towers[towerIndex].length - 1) {
        selectTower(towerIndex);
    }
}

function moveDisk(fromTower, toTower) {
    const fromStack = gameState.towers[fromTower];
    const toStack = gameState.towers[toTower];
    if (fromStack.length === 0) return false;

    const disk = fromStack[fromStack.length - 1];
    if (toStack.length === 0 || disk < toStack[toStack.length - 1]) {
        fromStack.pop();
        toStack.push(disk);
        gameState.moves++;
        updateDisplay();

        if (gameState.towers[2].length === gameState.diskCount) {
            endGame();
        }

        return true;
    }

    return false;
}

// =============================
// UI
// =============================
function highlightSelectedTower(towerIndex) {
    const towers = document.querySelectorAll('.tower');
    towers[towerIndex].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

    const topDisk = towers[towerIndex].querySelector('.disk:last-child');
    if (topDisk) topDisk.classList.add('selected');
}

function clearHighlight() {
    document.querySelectorAll('.tower').forEach(t => (t.style.backgroundColor = ''));
    document.querySelectorAll('.disk').forEach(d => d.classList.remove('selected'));
}

// =============================
// TIMER
// =============================
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(() => {
        gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        const minutes = Math.floor(gameState.gameTime / 60);
        const seconds = gameState.gameTime % 60;
        document.getElementById('timeCount').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// =============================
// FIN DEL JUEGO
// =============================
function endGame() {
    stopTimer();

    document.getElementById('finalTime').textContent = document.getElementById('timeCount').textContent;
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('finalAffinity').textContent = document.getElementById('affinity').textContent;

    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('show-flex');
}

function resetGame() {
    stopTimer();
    clearHighlight();

    if (document.getElementById('victoryScreen').classList.contains('show-flex')) {
        document.getElementById('victoryScreen').classList.remove('show-flex');
        document.getElementById('gameScreen').classList.add('show');
    }

    initHanoiGame(gameState.diskCount);
}

// =============================
// BOTONES DE DIFICULTAD
// =============================
function increaseDifficulty() {
    if (gameState.diskCount < 8) {
        initHanoiGame(gameState.diskCount + 1);
    }
}

function decreaseDifficulty() {
    if (gameState.diskCount > 3) {
        initHanoiGame(gameState.diskCount - 1);
    }
}
