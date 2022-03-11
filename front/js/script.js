//création de class
// class canapGen {
//     constructor(item, img, productName, productDescription) {
//         this.item = item;
//         this.img = img;
//         this.productName = productName;
//         this.productDescription = productDescription;
//     }
// }



// let canap = {
//     item: 'canap 1',
//     img: 'src= images/kanap01.jpeg',
//     productName: 'gg',
//     productDescription: 'blah blah blah'
// };

// const name = document.getElemenByClass('productName');
// const firstname = name[0]

// document.querySelector('#canap').innerText = `title: ${canap.title}
// ProducName: ${canap.productName} (nom du produit avant normalement)}`

// let trucTitle = canap.productName; // récupération console log ok mais pas site
// let trucdescription = canap.productDescription;

// let episode = {
//     title: 'Dark Beginnings',
//     duration: 45,
//     hasBeenWatched: false
//   };
  
  // Create variables here
  // =====================================
//   let episodeTitle = episode.title;
//   let episodeDuration = episode.duration;
//   let episodeHasBeenWatched = true;
  // =====================================
  
//   document.querySelector('#episode-info').innerText = `Episode: ${episodeTitle}
//   Duration: ${episodeDuration} min
//   ${episodeHasBeenWatched ? 'Already watched' : 'Not yet watched'}`

//   document.querySelector('#canap').innerText = `Item: ${trucTitle}
//   Duration: ${episodeDuration} min
//   ${episodeHasBeenWatched ? 'Already watched' : 'Not yet watched'}`

// let guests = []; // création d'un tableau vide
// let guests2 = ["Sarah Jane", "Anne Sophie lapisséLa", "Jean poloPlus"];

// let firstPersonne = guests2[0]; // la variable contiendra le nom de la première personne;

//---------------------------------------------------------------------------------------
// press key event version js

const keyPressContainer = document.querySelector(".keyPressMe"); // on attribue class du dom à une var const
// const keyPressContainer = document.getElementsByClassName('keyPressMe');
const keyMe = document.getElementById("keyMe"); // prend en charge ce qu'on tape

// ajout audio
const ring = () => { // ceci est une fonction
    const audio = new Audio();
    audio.src = "/front/son/se_web_test.mp3";
    audio.play(); 
}

// appel de la fonction : ring();

document.addEventListener('keypress', (e) => { // fonction qui prends 'keypress'
    // keyMe.textContent = "voici du text"; // ajoute du texte si touche appuyer
    keyMe.textContent = e.key;
    console.log(e.key);

    //mettre une condition en fonction de la lettre 
    if (e.key === "p"){
        keyPressContainer.style.background = "pink";
    }
    else {
         keyPressContainer.style.background = "bisque";
    }
    ring();
})

// console.log(keyMe);


// pour les image version dynamique, adopter la façon de faire de key + "mp3"en param
//exemple : si un fichier s'appel p.mp3, alors il jouera ce fichier
// const ring = (key) => { // ceci est une fonction
//     const audio = new Audio();
//     audio.src = key + ".mp3";
//     audio.play(); 
// }
// // appel de la fonction : ring();
// document.addEventListener('keypress', (e) => { 
//     keyMe.textContent = e.key;
//     console.log(e.key);
//     if (e.key === "p"){
//         keyPressContainer.style.background = "pink";
//     }
//     else {
//          keyPressContainer.style.background = "bisque";
//     }

//     ring(e.key);
// })

//---------------------------------------------------------------------------------------
// scroll event

const nav = document.querySelector(".navMe");
// console.log(nav);

window.addEventListener('scroll', () => {
    // console.log(window.scrollY);

    if (window.scrollY >= 120)
    {
        nav.style.top = 0;
    }
    else {
        nav.style.top = "-50px";
    }
});
// (e) dans la fonction, permet de récupérer les data's
//-------------------------------------------------------------------------------------------
// form event 

const inputName = document.querySelector('input[type="text"]'); // nouvel façon de pointer (vers un input css précis)
// console.log(inputName);
const selectMe = document.querySelector("select"); // cible la balise
// console.log(selectMe);
const formMe = document.querySelector("form");
// console.log(formMe);

let language = "";

// on peut stoker ce qui est tapé dans l'input
let nameMe ="";

inputName.addEventListener("input", (e) => {
    nameMe = e.target.value;
    // console.log(nom); // récup donné frappé dans l'input en tps réel
});

selectMe.addEventListener("input", (e) => {
    // console.log(e.target.value);
    language = e.target.value;
});

formMe.addEventListener("submit", (e) => {
    e.preventDefault(); // permet de ne pas recharger la page quand on valide le formulaire par def

    if (CGV.checked) { // pour les btn et checkbox pas besoin de déclarer de varaible
        console.log("yes !!"); // cible balise + injection html
        document.querySelector('form + div').innerHTML = ` 
        <div class="column">
        <h3>Nom : ${nameMe} </h3> 
        <h4>Langage préféré : ${language} </h4>
        </div>
        `;
    }
    else {
        alert('Veuillez accepter les conditions CGV')
    }
   
});

// innerHTML ajoute des balises

// -----------------------------------------------------------------------------------------------
// load event se charge après que la page se soit chargé... (?)
// appeler des fonctions (?)
window.addEventListener("load", () => {
    console.log("Doc chargé !!");
});


// -----------------------------------------------------------------------------------------------
// ForEach = pour chacun d'entre eux (intervient sur un class en multi)
// const box = document.getElementsByClassName("boxMe");

const boxes = document.querySelectorAll(".boxMe"); // préféré selecto pour tous sélectionner
console.log(boxes);

boxes.forEach((box) => {
    box.addEventListener("click", (e) => {
    // console.log(e.target);
    // console.log(boxIndi);
    e.target.style.transform = "scale(0.7)";
    });
});

// --------------------------------------------------------------------------------------------------
// event listener

//de base en false
document.body.addEventListener('click', () => {
    console.log("click avant tout ! mais non, car j'ai mis true pour la deuxième fonction !");
});

// Usecapture déclencher event à la fin - mettre un troisième argument ave true

document.body.addEventListener('click', () => {
    console.log("click avant tout !");
}, 
true);

//---------------------------------------------------------------------------------------------------
// stop propagation
keyPressContainer.addEventListener("click", (e) => {
    alert("test !");
    e.stopPropagation(); // arrête tout les event après (useCapture oui, mais le reste non)
});

//---------------------------------------------------------------------------------------------------
// removeEventListener, permet d'enlever un event listener
// --------------------------------------------------------------------------------------------------
// BOM brawser object model
// contient plusieurs param

// ouvrir une fenêtre au chargement de la page
// window.open('http://google.com', "cours js", "height=600, width=1000")

//-for normal--------------------------------------------------------------------------------------------------
// const numberOfPassengers = 10;
// for (let i = 0; i < numberOfPassengers; i++) {
//    console.log("Passager embarqué !");
// }

//-----------for in----------------------------------------------------------------------------------------
// const passengers = [
//     "Will Alexander",
//     "Sarah Kate'",
//     "Audrey Simon",
//     "Tao Perkington"
//     ]
    
//     for (let i in passengers) {
//        console.log("Embarquement du passager " + passengers[i]);
//     }

//---------for of--------------------------------------------------------------------------------------------------
// const passengers = [
//     {
//     name: "Will Alexander",
//     ticketNumber: 209542
//     },
    
//     {
//     name: "Sarah Kate",
//     ticketNumber: 169336
//     },
    
//     {
//     name: "Audrey Simon",
//     ticketNumber: 779042
//     },
    
//     {
//     name: "Tao Perkington",
//     ticketNumber: 703911
//     }
//     ]
    
//     for (let passenger of passengers) {
//        console.log('Embarquement du passager ' + passenger.name + ' avec le ticket numéro ' + passenger.ticketNumber);
//     }


//------------------------------------------------------------------------------------------------------------
const passengers = [

    "Will Alexander",

    "Sarah Kate",

    "Audrey Simon",

    "Tao Perkington"

];


let passengersBoarded = 10;


for (let i in passengers) {

    passengersBoarded++;

}

console.log(passengersBoarded);