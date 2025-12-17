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
                document.getElementById('pre-game-setup').classList.remove('blue-rotation');
                document.getElementById('setup-title').textContent = "JOUEUR ROUGE : Choisissez votre animal";
                alert("Bleu a choisi. Au tour de Rouge.");
                setupPreGame(); 
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
    ['board-blue', 'board-red'].forEach(id => {
        const grid = document.querySelector(`#${id} .card-grid`);
        grid.innerHTML = '';
        cardList.forEach(src => {
            const div = document.createElement('div');
            div.className = 'card';
            const img = document.createElement('img');
            img.src = src;
            div.appendChild(img);
            
            let timer;
            div.onclick = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    document.getElementById('modal-image').src = src;
                    document.getElementById('image-modal').style.display = 'flex';
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
    document.getElementById('board-blue').classList.toggle('blue-active', isBlueTurn);
    document.getElementById('board-red').classList.toggle('red-active', !isBlueTurn);
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

document.querySelectorAll('.modal').forEach(m => {
    m.onclick = () => m.style.display = 'none';
});

window.onload = setupPreGame;