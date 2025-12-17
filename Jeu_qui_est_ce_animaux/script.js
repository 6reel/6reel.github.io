// 1. Initialisation unique
const TOTAL_IMAGES = 156;
const ALL_IMAGES = [];
for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const num = i.toString().padStart(3, '0');
    ALL_IMAGES.push(`images/animal_${num}.jpg`);
}

// Les 15 mêmes images pour tout le monde
const cardList = [...ALL_IMAGES].sort(() => 0.5 - Math.random()).slice(0, 15);

let blueSecret = null;
let redSecret = null;
let isBlueTurn = true;
let setupPhase = 'blue';

// 2. Pré-menu (Sélection)
function setupPreGame() {
    const grid = document.getElementById('selection-grid');
    if (!grid) return;
    grid.innerHTML = '';

    cardList.forEach(src => {
        const div = document.createElement('div');
        div.className = 'card';
        const img = document.createElement('img');
        img.src = src;
        img.onerror = () => img.src = "https://via.placeholder.com/150?text=Erreur";
        
        div.onclick = () => {
            if (setupPhase === 'blue') {
                blueSecret = src;
                setupPhase = 'red';
                document.getElementById('pre-game-setup').classList.remove('blue-rotation');
                document.getElementById('setup-title').textContent = "JOUEUR ROUGE : Choisissez votre animal";
                alert("Bleu a choisi. Au tour de Rouge !");
                setupPreGame(); 
            } else if (setupPhase === 'red') {
                redSecret = src;
                setupPhase = 'done';
                document.getElementById('pre-game-setup').style.display = 'none';
                document.getElementById('main-game').style.display = 'flex';
                initBoards();
            }
        };
        div.appendChild(img);
        grid.appendChild(div);
    });
}

// 3. Plateaux de jeu
function initBoards() {
    ['board-blue', 'board-red'].forEach(id => {
        const grid = document.querySelector(`#${id} .card-grid`);
        grid.innerHTML = '';
        cardList.forEach(src => {
            const div = document.createElement('div');
            div.className = 'card';
            const img = document.createElement('img');
            img.src = src;
            
            let timer;
            div.onclick = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    document.getElementById('modal-image').src = src;
                    document.getElementById('image-modal').style.display = 'flex';
                }, 200);
            };
            div.ondblclick = (e) => {
                e.preventDefault();
                clearTimeout(timer);
                div.classList.toggle('removed');
            };
            
            div.appendChild(img);
            grid.appendChild(div);
        });
    });
    updateTurnUI();
}

// 4. Gestion des tours
function updateTurnUI() {
    document.getElementById('board-blue').classList.toggle('blue-active', isBlueTurn);
    document.getElementById('board-red').classList.toggle('red-active', !isBlueTurn);
    document.getElementById('next-turn-btn').className = isBlueTurn ? '' : 'red-turn';
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

// 5. FERMETURE FACILE DES MODALS
function closeAllModals() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('reveal-modal').style.display = 'none';
}

// Fermer en cliquant n'importe où sur le fond ou sur l'image zoomée
document.getElementById('image-modal').onclick = closeAllModals;
document.getElementById('reveal-modal').onclick = function(e) {
    // Ne ferme la révélation que si on clique sur le fond noir ou le bouton
    if (e.target.id === 'reveal-modal' || e.target.classList.contains('close-btn')) {
        closeAllModals();
    }
};

window.onload = setupPreGame;