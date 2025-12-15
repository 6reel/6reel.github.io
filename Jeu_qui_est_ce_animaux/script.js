// --- 1. CONFIGURATION ET DONNÉES ---
const TOTAL_IMAGES = 156; 
const ALL_ANIMALS = [];

for (let i = 1; i <= TOTAL_IMAGES; i++) {
    // Utilisation de padStart(3, '0') pour le format 001 à 156.
    const paddedNumber = i.toString().padStart(3, '0');
    ALL_ANIMALS.push(`images/animal_${paddedNumber}.jpg`);
}

const CARDS_PER_PLAYER = 15;
let isBlueTurn = true;
let cardList = []; 
let blueSelectedCard = null;
let redSelectedCard = null;
let setupPhase = 'blue'; 

// --- 2. FONCTIONS UTILITAIRES ---

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function getPlayerCards() {
    const shuffledAnimals = shuffle([...ALL_ANIMALS]);
    return shuffledAnimals.slice(0, CARDS_PER_PLAYER);
}

// --- 3. GESTION DU PRÉ-MENU (SÉLECTION) ---

function createSelectionCardElement(imgSrc, index, showNumber = true) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.dataset.src = imgSrc;
    cardDiv.dataset.index = index;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Animal n°${index + 1}`;

    cardDiv.appendChild(img);

    cardDiv.addEventListener('click', () => handleSecretSelection(cardDiv));
    
    if (showNumber) {
        const numberOverlay = document.createElement('div');
        numberOverlay.textContent = index + 1; // 1 à 15
        numberOverlay.style.cssText = 'position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.5); color: white; padding: 2px 5px; border-radius: 0 4px 0 4px; font-size: 0.8em;';
        cardDiv.appendChild(numberOverlay);
    }

    return cardDiv;
}

function handleSecretSelection(card) {
    const src = card.dataset.src;

    if (setupPhase === 'blue') {
        blueSelectedCard = src;
        setupPhase = 'red';
        
        alert("Carte secrète du Joueur Bleu choisie. Passons l'appareil au Joueur Rouge pour son choix.");
        
        // Retirer la rotation du pré-menu pour le joueur Rouge (pour qu'il voit la grille normalement, en bas)
        document.getElementById('pre-game-setup').classList.remove('blue-rotation');
        
        // Réinitialise la grille pour le joueur Rouge (sans aucun indice visuel)
        setupPreGame(false); 
        
        document.getElementById('setup-title').textContent = 'Joueur ROUGE : Choisissez votre animal secret (1/15)';
        document.getElementById('setup-title').style.color = '#e74c3c';

    } else if (setupPhase === 'red') {
        redSelectedCard = src;
        setupPhase = 'done';
        
        // Démarrage du jeu
        document.getElementById('pre-game-setup').style.display = 'none';
        document.getElementById('main-game').style.display = 'flex';
        renderGameBoards(); 
        alert("Les deux cartes secrètes sont choisies. Le jeu peut commencer ! Joueur Bleu commence.");
        
    }
}

function setupPreGame(isInitialSetup = true) {
    if (isInitialSetup) {
        cardList = getPlayerCards(); 
    }
    
    const selectionGrid = document.getElementById('selection-grid');
    selectionGrid.innerHTML = '';

    cardList.forEach((imgSrc, index) => {
        selectionGrid.appendChild(createSelectionCardElement(imgSrc, index, isInitialSetup));
    });
}

// --- 4. GESTION DES PLATEAUX DE JEU ---

function createCardElement(imgSrc, boardId) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.dataset.src = imgSrc;
    cardDiv.dataset.player = boardId === 'board-blue' ? 'blue' : 'red';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Animal à deviner';

    cardDiv.appendChild(img);
    setupCardEvents(cardDiv);

    return cardDiv;
}

function renderGameBoards() {
    // Rend le plateau Bleu
    const gridBlue = document.getElementById('board-blue').querySelector('.card-grid');
    gridBlue.innerHTML = '';
    cardList.forEach(imgSrc => {
        gridBlue.appendChild(createCardElement(imgSrc, 'board-blue'));
    });
    
    // Rend le plateau Rouge
    const gridRed = document.getElementById('board-red').querySelector('.card-grid');
    gridRed.innerHTML = '';
    cardList.forEach(imgSrc => {
        gridRed.appendChild(createCardElement(imgSrc, 'board-red'));
    });
    
    toggleTurn(); 
}

// --- 5. GESTION DES ÉVÉNEMENTS (CLICS) ---

function handleSingleClick(card) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (card.classList.contains('removed')) return;
    
    modalImg.src = card.dataset.src;
    modal.style.display = "block";
    
    // Si la carte vient du plateau Bleu (tourné)
    if(card.closest('.blue-rotation')) {
        // L'image est tournée à 180° dans le jeu, on la remet à 0° dans la modal pour la voir à l'endroit
        modalImg.style.transform = 'translate(-50%, -50%) rotate(0deg)'; 
    } else {
        // Plateau Rouge (non tourné)
        modalImg.style.transform = 'translate(-50%, -50%) rotate(0deg)'; 
    }
}

function handleDoubleClick(card) {
    const isCurrentPlayerCard = (isBlueTurn && card.dataset.player === 'blue') || 
                                (!isBlueTurn && card.dataset.player === 'red');
    
    if (isCurrentPlayerCard) {
        card.classList.toggle('removed');
    }
}

function setupCardEvents(card) {
    let clickTimer = null;

    card.addEventListener('click', (e) => {
        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                handleSingleClick(card);
                clickTimer = null;
            }, 300);
        }
    });

    card.addEventListener('dblclick', (e) => {
        clearTimeout(clickTimer);
        clickTimer = null;
        handleDoubleClick(card);
    });
}

document.getElementById('image-modal').addEventListener('click', (e) => {
    document.getElementById('image-modal').style.display = "none";
});

// --- 6. GESTION DU TOUR ET DES BOUTONS CENTRAUX ---

function toggleTurn() {
    isBlueTurn = !isBlueTurn;
    
    const boardBlue = document.getElementById('board-blue');
    const boardRed = document.getElementById('board-red');
    const toggleBtn = document.getElementById('next-turn-btn');

    boardBlue.classList.toggle('blue-active', isBlueTurn);
    boardRed.classList.toggle('red-active', !isBlueTurn);

    toggleBtn.classList.toggle('blue-turn', isBlueTurn);
    toggleBtn.classList.toggle('red-turn', !isBlueTurn);
}

document.getElementById('next-turn-btn').addEventListener('click', toggleTurn);

// Gestion du bouton Révéler (👁️)
document.getElementById('reveal-btn').addEventListener('click', () => {
    if (!blueSelectedCard || !redSelectedCard) {
        alert("Les cartes secrètes n'ont pas encore été choisies !");
        return;
    }

    document.getElementById('reveal-blue-img').src = blueSelectedCard;
    document.getElementById('reveal-red-img').src = redSelectedCard;
    
    document.getElementById('reveal-modal').style.display = 'flex';
});

// Fermeture de la modal de révélation
document.getElementById('close-reveal-modal').addEventListener('click', () => {
    document.getElementById('reveal-modal').style.display = 'none';
});

// --- 7. INITIALISATION DU JEU ---

document.addEventListener('DOMContentLoaded', () => setupPreGame(true));