const TOTAL_IMAGES = 156;
const ALL_ANIMALS = [];
for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const padded = i.toString().padStart(3, '0');
    ALL_ANIMALS.push(`images/animal_${padded}.jpg`);
}

const CARDS_PER_PLAYER = 15;
let cardList = [];
let blueSecret = null, redSecret = null;
let isBlueTurn = true;
let setupPhase = 'blue';

function setupPreGame() {
    // Mélange et sélection des 15 images
    cardList = [...ALL_ANIMALS].sort(() => 0.5 - Math.random()).slice(0, CARDS_PER_PLAYER);
    const grid = document.getElementById('selection-grid');
    grid.innerHTML = '';
    
    cardList.forEach(src => {
        const div = document.createElement('div');
        div.className = 'card';
        const img = document.createElement('img');
        img.src = src;
        div.appendChild(img);
        
        div.onclick = () => {
            if (setupPhase === 'blue') {
                blueSecret = src;
                setupPhase = 'red';
                // On enlève la rotation pour que le joueur Rouge choisisse à l'endroit
                document.getElementById('pre-game-setup').classList.remove('blue-rotation');
                document.getElementById('setup-title').textContent = "JOUEUR ROUGE : Choisissez votre animal";
                alert("Bleu a choisi. Au tour de Rouge !");
            } else {
                redSecret = src;
                document.getElementById('pre-game-setup').style.display = 'none';
                document.getElementById('main-game').style.display = 'flex';
                renderGame();
            }
        };
        grid.appendChild(div);
    });
}

function renderGame() {
    const boards = ['board-blue', 'board-red'];
    boards.forEach(id => {
        const grid = document.querySelector(`#${id} .card-grid`);
        grid.innerHTML = '';
        cardList.forEach(src => {
            const div = document.createElement('div');
            div.className = 'card';
            const img = document.createElement('img');
            img.src = src;
            div.appendChild(img);
            
            // Interaction tactile optimisée
            let timer;
            div.onclick = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    const modal = document.getElementById('image-modal');
                    document.getElementById('modal-image').src = src;
                    modal.style.display = 'flex';
                }, 200);
            };
            div.ondblclick = () => {
                clearTimeout(timer);
                div.classList.toggle('removed');
            };
            grid.appendChild(div);
        });
    });
    updateTurnUI();
}

function updateTurnUI() {
    const btn = document.getElementById('next-turn-btn');
    btn.className = isBlueTurn ? 'blue-turn' : 'red-turn';
    
    // Application des classes pour l'effet grisé
    const boardBlue = document.getElementById('board-blue');
    const boardRed = document.getElementById('board-red');
    
    if (isBlueTurn) {
        boardBlue.classList.add('blue-active');
        boardRed.classList.remove('red-active');
    } else {
        boardBlue.classList.remove('blue-active');
        boardRed.classList.add('red-active');
    }
}

document.getElementById('next-turn-btn').onclick = () => {
    isBlueTurn = !isBlueTurn;
    updateTurnUI();
};

document.getElementById('reveal-btn').onclick = () => {
    document.getElementById('reveal-blue-img').src = blueSecret;
    document.getElementById('reveal-red-img').src = redSecret;
    document.getElementById('reveal-modal').style.display = 'flex';
};

// Fermeture des modals au clic
document.querySelectorAll('.modal').forEach(m => {
    m.onclick = () => m.style.display = 'none';
});

window.onload = setupPreGame;