// Variables globales
let currentTheme = 'blue';
let gameState = {
    towers: [[], [], []],
    selectedTower: null,
    moves: 0,
    startTime: null,
    gameTime: 0,
    timerInterval: null,
    diskCount: 4,
    minMoves: 15 // 2^n - 1 para n discos
};
// Colores del tema
const themes = {
    black: { primary: '#2C2C2C', secondary: '#4A4A4A', accent: '#666666' },
    red: { primary: '#DC143C', secondary: '#FF6B6B', accent: '#FF4757' },
    yellow: { primary: '#FFD700', secondary: '#FFC312', accent: '#F79F1F' },
    green: { primary: '#32CD32', secondary: '#00D2D3', accent: '#17C0EB' },
    blue: { primary: '#00BFFF', secondary: '#87CEEB', accent: '#1E90FF' },
    purple: { primary: '#8A2BE2', secondary: '#DA70D6', accent: '#9B59B6' },
    white: { primary: '#F5F5F5', secondary: '#E8E8E8', accent: '#DCDCDC' }
};

// Funciones para manejo de localStorage del color
function saveTheme(theme) {
    try {
        // Usar variables en memoria como fallback
        window.selectedTheme = theme;
        currentTheme = theme;
    } catch (error) {
        console.warn('No se pudo guardar el tema:', error);
        window.selectedTheme = theme;
        currentTheme = theme;
    }
}

function loadTheme() {
    try {
        // Intentar cargar desde variable global
        return window.selectedTheme || currentTheme;
    } catch (error) {
        console.warn('No se pudo cargar el tema:', error);
        return currentTheme;
    }
}

// Función para aplicar tema
function updateTheme() {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    
    // Aplicar clase especial para tema blanco
    if (currentTheme === 'white') {
        document.body.classList.add('white-theme');
    } else {
        document.body.classList.remove('white-theme');
    }
}

// Funciones de navegación
function navigateToMenu() {
    saveTheme(currentTheme);
    window.location.href = 'menu.html';
}

function navigateToLogin() {
    saveTheme(currentTheme);
    window.location.href = 'login.html';
}

function navigateToHanoi() {
    saveTheme(currentTheme);
    window.location.href = 'hannoi.html';
}
function navigateToMenu() {
    saveTheme(currentTheme);
    window.location.href = 'menu.html';
}
function navigateToQuince() {
    saveTheme(currentTheme);
    window.location.href = 'quince.html';
}
function navigateToPeg() {
    saveTheme(currentTheme);
    window.location.href = 'peg.html';
}


// Inicialización común para todas las páginas
function initSharedComponents() {
    // Cargar tema guardado
    currentTheme = loadTheme();
    updateTheme();
    
    // Configurar botones de color si existen
    const colorBtns = document.querySelectorAll('.color-btn');
    if (colorBtns.length > 0) {
        initColorSelection();
    }
    
    // Marcar color activo
    updateActiveColorButton();
}

function initColorSelection() {
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTheme = this.dataset.color;
            updateTheme();
            saveTheme(currentTheme);
        });
    });
}

function updateActiveColorButton() {
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        if (btn.dataset.color === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Específico para login.html
function login() {
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (password === '1') {
        navigateToMenu();
    } else {
        errorMessage.classList.remove('hidden');
        document.getElementById('passwordInput').value = '';
    }
}

// Específico para menu.html  
function startGame(gameType) {
    if (gameType === 'torres-hanoi') {
        navigateToHanoi();
    }
    if (gameType === 'ordena-15') {
        navigateToQuince();
    }
    if (gameType === 'piramides-peg') {
        navigateToPeg();
    }
    else {
        alert('Juego no implementado aún: ' + gameType);
    }
}

// Funciones de navegación para hanoi.html
function goToMenu() {
    // Detener juego si está corriendo
    if (typeof stopTimer === 'function') {
        stopTimer();
    }
    if (typeof clearHighlight === 'function') {
        clearHighlight();
    }
    navigateToMenu();
}

// Event listeners comunes
document.addEventListener('DOMContentLoaded', function() {
    initSharedComponents();
    
    // Setup específico para login
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});


function initHanoiGame() {
    // Reiniciar estado del juego
    gameState = {
        towers: [[], [], []],
        selectedTower: null,
        moves: 0,
        startTime: Date.now(),
        gameTime: 0,
        timerInterval: null,
        diskCount: 4,
        minMoves: 15
    };
    // Inicializar discos en la primera torre
    for (let i = gameState.diskCount; i >= 1; i--) {
        gameState.towers[0].push(i);
    }
    updateDisplay();
    startTimer();
}
function updateDisplay() {
    const towersContainer = document.getElementById('towersContainer');
    const towers = towersContainer.querySelectorAll('.tower');
    // Limpiar torres
    towers.forEach(tower => {
        tower.innerHTML = '';
        // Agregar línea vertical
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
    // Renderizar discos
    gameState.towers.forEach((tower, towerIndex) => {
        const towerElement = towers[towerIndex];
        tower.forEach((diskSize, diskIndex) => {
            const disk = document.createElement('div');
            disk.className = `disk disk-${diskSize}`;
            disk.onclick = () => selectDisk(towerIndex, diskIndex);
            towerElement.appendChild(disk);
        });
    });
    // Actualizar contador de movimientos
    document.getElementById('movesCount').textContent = gameState.moves;
    
    // Actualizar afinidad
    const affinity = Math.max(0, Math.round((gameState.minMoves / Math.max(gameState.moves, 1)) * 100));
    document.getElementById('affinity').textContent = affinity + '%';
}
function selectTower(towerIndex) {
    if (gameState.selectedTower === null) {
        // Seleccionar disco superior de la torre
        if (gameState.towers[towerIndex].length > 0) {
            gameState.selectedTower = towerIndex;
            highlightSelectedTower(towerIndex);
        }
    } else {
        // Intentar mover disco a esta torre
        moveDisk(gameState.selectedTower, towerIndex);
        gameState.selectedTower = null;
        clearHighlight();
    }
}
function selectDisk(towerIndex, diskIndex) {
    // Solo permitir seleccionar el disco superior
    if (diskIndex === gameState.towers[towerIndex].length - 1) {
        selectTower(towerIndex);
    }
}
function moveDisk(fromTower, toTower) {
    const fromStack = gameState.towers[fromTower];
    const toStack = gameState.towers[toTower];
    if (fromStack.length === 0) return false;
    const disk = fromStack[fromStack.length - 1];
    
    // Verificar si el movimiento es válido
    if (toStack.length === 0 || disk < toStack[toStack.length - 1]) {
        fromStack.pop();
        toStack.push(disk);
        gameState.moves++;
        updateDisplay();
        
        // Verificar victoria
        if (gameState.towers[2].length === gameState.diskCount) {
            endGame();
        }
        
        return true;
    }
    
    return false;
}
function highlightSelectedTower(towerIndex) {
    const towers = document.querySelectorAll('.tower');
    towers[towerIndex].style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    
    const topDisk = towers[towerIndex].querySelector('.disk:last-child');
    if (topDisk) {
        topDisk.classList.add('selected');
    }
}
function clearHighlight() {
    const towers = document.querySelectorAll('.tower');
    towers.forEach(tower => {
        tower.style.backgroundColor = '';
    });
    
    const disks = document.querySelectorAll('.disk');
    disks.forEach(disk => {
        disk.classList.remove('selected');
    });
}
function startTimer() {
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
function endGame() {
    stopTimer();
    
    // Actualizar estadísticas finales
    const finalTime = document.getElementById('timeCount').textContent;
    const finalMoves = gameState.moves;
    const finalAffinity = document.getElementById('affinity').textContent;
    
    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('finalMoves').textContent = finalMoves;
    document.getElementById('finalAffinity').textContent = finalAffinity;
    
    // Mostrar pantalla de victoria
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
    
    initHanoiGame();
}
