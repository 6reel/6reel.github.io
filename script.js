var fullscreenButton = document.getElementById("fullscreen-button");
var fullscreenImage = fullscreenButton.querySelector("img");

if (document.documentElement.requestFullscreen) {
  fullscreenButton.addEventListener("click", function() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullscreenImage.src = "imgs/fullscreen.png";
    } else {
      document.documentElement.requestFullscreen();
      fullscreenImage.src = "imgs/exit-fullscreen.png";
    }
  });
} else {
  fullscreenButton.style.display = "none";
}



let increment = 0;
const posXY = [];
let nbrhearts=0;
let nbrDizaines=0;
let dizaine1=0;
let dizaine2=0;
let dizaine3=0;
let dizaine4=0;
let dizaine5=0;
let dizaine6=0;
let dizaine7=0;
let dizaine8=0;
let dizaine9=0;
let nbrverif=0;

Pics= [ ["coeur","imgs/coeur.png"], 
        ["pomme","imgs/pomme.jpg"], 
        ["ours","imgs/ours.jpg"],
        ["chien","imgs/chien.jpg"],
        ["soleil","imgs/soleil.jpg"],
        ["poisson","imgs/poisson.jpg"]
       ]; 

function createTable() {
  Table = document.createElement('table');

  for (let i = 0; i < 10; i++) {
    line = document.createElement('tr');
    for (let j = 0; j < 10; j++) {
      cell = document.createElement('td');
      cell.id = "cell" + i + "_" + j;
      line.appendChild(cell);
    }
    Table.appendChild(line)
  }
  document.querySelector('.bandeau-domino-right').appendChild(Table);
}
createTable();

function clonePic() {
  // recuperation de la resolution de l'ecran chez l'utilisateur
  largeur = window.innerWidth;
  hauteur = window.innerHeight;
  // positionnement aleatoire
  cellpos = posXY.pop();

  // recuperation de l'element div servant a afficher l'image
  ImageHeart = document.getElementById("elemImage").cloneNode(true);
  // ajustement de l'attribute style, notament left et top
  ImageHeart.style.width = "50px";
  ImageHeart.style.height = "50px";
  ImageHeart.id = 'DivCoeur' + increment;
  ImageHeart.style.display = "inline-block";
  ImageHeart.classList.add('imgRonde');
  ImageHeart.onclick= function(){
   			this.classList.add("picClicked");
  			nbrverif = document.querySelectorAll('.picClicked').length;
        }
  document.getElementById('cell' + cellpos).appendChild(ImageHeart);

}

function populate() {
  let run = document.getElementById('populate').dataset.running;
  if (run == "true") {
   return false;
  }
 document.getElementById('populate').dataset.running =  "true" ;
  posXY.length = 0;   // il faut faire une remise à zéro
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      posXY.push(i + '_' + j);
    }
    
  }
  posXY.sort(() => Math.random() - 0.5);
  let maxhearts = 99;
  nbrhearts= Math.ceil(Math.random() * maxhearts);
  for (p = 0; p < nbrhearts; p++) {
    clonePic();
  }
}

function effacer() {
  let allhearts = document.querySelectorAll('[id^=DivCoeur]');
  if (allhearts.length > 0) {
    for (var heart of allhearts) {
      heart.parentNode.removeChild(heart.parentNode.firstChild);
    }
  //random image
  Pics.sort(() => Math.random() - 0.5);
  document.getElementById('elemImage').src=Pics[0][1];
  document.getElementById('populate').dataset.running="false";
 	document.getElementById('affichagediz').innerHTML = 0 ;
  document.getElementById('affichageuni').innerHTML = 0 ; 
 document.getElementById("titre-domino").innerHTML = "Dizaine réalisée";
 
    for (let i = affichage_domino.childNodes.length - 1; i >= 0; i--) {
  affichage_domino.removeChild(affichage_domino.childNodes[i]);
}

  }
}

function verifier() {
  const nbrOK = document.querySelectorAll("[class*='dix']").length;
  const nbrDizaines = nbrOK / 10;
  const picsclicked = document.querySelectorAll(".picClicked");
  const newnbrDizaines = 0;
  
  if (nbrDizaines!=0) {
     document.getElementById("titre-domino").innerHTML = "Dizaines réalisées";
  }
  
  if (10 === nbrverif) {
    // class à appliquer
   const newnbrDizaines = nbrDizaines + 1;
    
    const nomClass = "dix" + newnbrDizaines ;
    for (const picclicked of picsclicked) {
      picclicked.classList.remove("picClicked");
      picclicked.classList.add(nomClass);
      picclicked.onclick = {};
    }
 const myImage = new Image(150, 77);
myImage.src = 'imgs/'+Pics[0][0]+newnbrDizaines+'.jpg';
affichage_domino.appendChild(myImage);  
  }
  else {
    for (const picclicked of picsclicked) {
      picclicked.classList.remove("picClicked");
    }
    dixRate();
  }
   nbrverif = 0;
}

let nbrAfficheDiz = 0;
let resultat =0 ;
function nbrAvantDiz() {
	if (nbrAfficheDiz==0) {
		nbrAfficheDiz=9;
	}else{
		nbrAfficheDiz=nbrAfficheDiz-1;
	}
	document.getElementById("affichagediz").innerHTML = nbrAfficheDiz;
  resultat=nbrAfficheUni+nbrAfficheDiz*10;
}
 
function nbrApresDiz() {
	if (nbrAfficheDiz==9) {
		nbrAfficheDiz=0;
	}else{
		nbrAfficheDiz= nbrAfficheDiz+1;
	}
	document.getElementById("affichagediz").innerHTML = nbrAfficheDiz;
  resultat=nbrAfficheUni+nbrAfficheDiz*10;
}

let nbrAfficheUni = 0;
function nbrAvantUni() {
	if (nbrAfficheUni==0) {
		nbrAfficheUni=9;
	}else{
		nbrAfficheUni=nbrAfficheUni-1;
	}
	document.getElementById("affichageuni").innerHTML = nbrAfficheUni;
  resultat=nbrAfficheUni+nbrAfficheDiz*10;
}
 
function nbrApresUni() {
	if (nbrAfficheUni==9) {
		nbrAfficheUni=0;
	}else{
		nbrAfficheUni= nbrAfficheUni+1;
	}
	document.getElementById("affichageuni").innerHTML = nbrAfficheUni;
  resultat=nbrAfficheUni+nbrAfficheDiz*10;
}

function validNombre () {
  if (resultat==nbrhearts) {
    dixGagne();
  }
  else {
    dixPerdu();
  }
}



function dixGagne () {
    const title = "<span class='bingo'>BRAVO</span>";  // stylé directement en CSS
    const msg = "<img src='imgs/yes.gif'><br>C'était bien "+nbrhearts+".";
    showModal(title, msg);
  }

function dixPerdu () {
    const title = "<span class='error'>DOMMAGE</span>";  // stylé directement en CSS
    const msg = "<img src='imgs/no.gif'><br>Cherche encore.";
    showModal(title, msg);
  }

  function dixRate () {
    const title = "<span class='error'>DOMMAGE</span>";  // stylé directement en CSS
    const msg = "<img src='imgs/dixrate.gif'><br>Ca ne fait pas 10.";
    showModal(title, msg);
  }

/*Création de la boite de dialogue*/
function showModal(title,html) {
  modal.querySelector(".modal-header").innerHTML = title;
  modal.querySelector(".modal-content").innerHTML = html;
  modal.showModal();
};

this.modal = document.getElementById("modal-info");
  const btnClose = modal.querySelector("[data-role='close']");
  btnClose.addEventListener("click", () => {
    modal.close();
  });