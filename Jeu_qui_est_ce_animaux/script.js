const TOTAL_IMAGES = 156;
const ALL_ANIMALS = [];

for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const paddedNumber = i.toString().padStart(3, '0');
    ALL_ANIMALS.push(`images/animal_${paddedNumber}.jpg`);
}

const CARDS_PER_PLAYER = 15;
let cardList = [];
let blueSelectedCard = null, redSelectedCard = null;
let isBlueTurn = true;
let setupPhase = 'blue';

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setupPreGame() {
    cardList = shuffle([...ALL_ANIMALS]).slice(0, CARDS_PER_PLAYER);
    const grid = document.getElementById('selection-grid');
    grid.innerHTML = '';
    
    cardList.forEach(src => {
        const div = document.createElement('div');
        div.className = 'card';
        const img = document.createElement('img');
        img.src = src;
        // Gestion des erreurs d'images
        img.onerror = () => { img.src = 'https://via.placeholder.com/150?text=Erreur'; };
        div.onclick = () => selectSecret(src);
        div.appendChild(img);
        grid.appendChild(div);
    });
}

function selectSecret(src) {
    if (setupPhase === 'blue') {
        blueSelectedCard = src;
        setupPhase = 'red';
        document.getElementById('pre-game-setup').classList.remove('blue-rotation');
        document.getElementById('setup-title').textContent = "Joueur ROUGE : Choisissez votre animal";
        alert("Bleu a choisi ! Au tour de Rouge.");
    } else {
        redSelectedCard = src;
        document.getElementById('pre-game-setup').style.display = 'none';
        document.getElementById('main-game').style.display = 'flex';
        renderBoards();
    }
}

function renderBoards() {
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
            
            // Double clic pour barrer, simple clic pour agrandir
            let timer;
            div.onclick = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    document.getElementById('modal-image').src = src;
                    document.getElementById('image-modal').style.display = 'flex';
                }, 250);
            };
            div.ondblclick = () => {
                clearTimeout(timer);
                div.classList.toggle('removed');
            };
            grid.appendChild(div);
        });
    });
}

document.getElementById('next-turn-btn').onclick = () => {
    isBlueTurn = !isBlueTurn;
    document.getElementById('next-turn-btn').className = isBlueTurn ? 'blue-turn' : 'red-turn';
    document.getElementById('board-blue').classList.toggle('blue-active', isBlueTurn);
    document.getElementById('board-red').classList.toggle('red-active', !isBlueTurn);
};

document.getElementById('reveal-btn').onclick = () => {
    document.getElementById('reveal-blue-img').src = blueSelectedCard;
    document.getElementById('reveal-red-img').src = redSelectedCard;
    document.getElementById('reveal-modal').style.display = 'flex';
};

document.querySelectorAll('.modal').forEach(m => {
    m.onclick = () => m.style.display = 'none';
});

window.onload = setupPreGame;