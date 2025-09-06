const canvas = document.querySelector('.canvas');
const tiles = Array.from(canvas.children);
const selectorModo = document.getElementById('modo');

// Reconvertimos HTML a array lógico
function getTablero() {
    return tiles.map(tile => parseInt(tile.textContent) || 0);
}

// Detectar clic en una ficha
tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
        const tablero = getTablero();
        const posVacio = tablero.indexOf(0);
        const fila = i => Math.floor(i / 4);
        const col = i => i % 4;
        const i = index;
        const f1 = fila(i), c1 = col(i);
        const f0 = fila(posVacio), c0 = col(posVacio);
        const esAdyacente = (Math.abs(f1 - f0) + Math.abs(c1 - c0)) === 1;
        if (esAdyacente) {
            const temp = tile.textContent;
            tiles[i].textContent = '';
            tiles[posVacio].textContent = temp;
        }
        if (esGanado(getTablero())) {
            setTimeout(() => alert("¡Ganaste!"), 100);
        }
    });
});

const botonShuffle = document.querySelector('.shuffle');
botonShuffle.addEventListener('click', () => {
    let nuevoTablero;
    do {
        nuevoTablero = [...Array(15).keys()].map(x => x + 1);
        nuevoTablero.push(0);
        shuffleArray(nuevoTablero);
    } while (!esSolvable(nuevoTablero));

    tiles.forEach((tile, i) => {
        tile.textContent = nuevoTablero[i] === 0 ? '' : nuevoTablero[i];
    });

    actualizarDataSolution();
});

// Mezcla Fisher-Yates
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Verifica si el arreglo es resoluble
function esSolvable(arr) {
    let inv = 0;
    for (let i = 0; i < 15; i++) {
        for (let j = i + 1; j < 16; j++) {
            if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
        }
    }
    const filaVacia = Math.floor(arr.indexOf(0) / 4);
    const desdeAbajo = 3 - filaVacia;
    return (inv + desdeAbajo) % 2 === 0;
}

// Modos de victoria
function esGanado(tablero) {
    const modo = selectorModo.value;

    switch (modo) {
        case 'normal':
            for (let i = 0; i < 15; i++) if (tablero[i] !== i + 1) return false;
            return tablero[15] === 0;

        case 'inverso':
            // Queremos [0, 15, 14, ..., 2, 1]
            if (tablero[0] !== 0) return false;
            for (let i = 1; i < 16; i++) {
                if (tablero[i] !== 16 - i) return false;
            }
            return true;
            
        case 'vertical':
            const vertical = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,0];
            for (let i = 0; i < 16; i++) if (tablero[i] !== vertical[i]) return false;
            return true;

        case 'skip':
            const skip = [1,3,5,7,2,4,6,8,9,11,13,15,10,12,14,0];
            for (let i = 0; i < 16; i++) if (tablero[i] !== skip[i]) return false;
            return true;

        default:
            return false;
    }
}

// Mostrar solución
function actualizarDataSolution() {
    const modo = selectorModo.value;
    let orden;

    switch (modo) {
        case 'normal':
            orden = [...Array(15).keys()].map(i => i + 1).concat(0);
            break;
        case 'inverso':
            // Solución esperada: [0, 15, 14, ..., 2, 1]
            orden = [0].concat([...Array(15).keys()].map(i => 15 - i));
            break;
        case 'vertical':
            orden = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,0];
            break;
        case 'skip':
            orden = [1,3,5,7,2,4,6,8,9,11,13,15,10,12,14,0];
            break;
        default:
            orden = [...Array(15).keys()].map(i => i + 1).concat(0);
    }

    tiles.forEach((tile, i) => {
        tile.setAttribute('data-solution', orden[i] === 0 ? '' : orden[i]);
    });
}
selectorModo.addEventListener('change', actualizarDataSolution);

const btnSol = document.getElementById('mostrarSolucion');
btnSol.addEventListener('click', () => {
  canvas.classList.toggle('con-solucion');
  btnSol.textContent = canvas.classList.contains('con-solucion')
    ? 'Ocultar solución'
    : 'Mostrar solución';
});

actualizarDataSolution();

