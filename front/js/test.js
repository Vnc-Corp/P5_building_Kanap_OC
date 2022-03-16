// const product_item_solo = window.location.search.split("?").join("");
// // ajouter split à la fin enlève qu'on ne veut pas et .join enlève l'élément vide /!\
// console.table(product_item_solo);

// const { getAllProducts } = require("../../back/controllers/product");
// const { get } = require("../../back/routes/product");

// let productData = [];

// const fetchProduit = async () => {
//     await fetch(``)
// }

// va chercher l'id du produit que j'affiche dans la page procuct
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id"); // va chercher les paramètres de la route back-end js

let articleSolo = "";

//--------------------------------------------------------------
newArray();
//------------------------------------------------------------------------------------------------
getArticleSolo();
getSelectValue();
//------------------------------------------------------------------------------------------------
async function getArticleSolo() {
    console.log(productId);
    fetch("http://localhost:3000/api/products/" + productId) 
    .then ((response) => {
        return response.json()
    })
    
    .then(function (dataAPI){
        articleSolo = dataAPI;
        // console.table(articleSolo);
        if (articleSolo){
            return displayArticleSolo(articleSolo); // attribut la variable à une fonction (qui va afficher)
        }
    })
    
    .catch((error) => {
        console.log("Erreur de la requête API");
    })
};

// const select_elt = document.getElementById("colors"); // cible le select color
// let option_elt = document.createElement("option").appendChild(select_elt); // création de l'éléments option
// console.log(option_elt);

let option_elt = document.createElement("option"); // création de l'éléments option
// let valueColor = select_elt.option[choiceColor].value;

select_elt = option_elt;
// console.log(valueColor);

async function displayArticleSolo(articleSolo) {
    // console.table(articleSolo);
    
    const title_elt = document.getElementById("title").innerHTML = articleSolo.name;
    const price_elt = document.getElementById("price").innerHTML = articleSolo.price;
    const description_elt = document.getElementById("description").innerHTML = articleSolo.description;

    const img_elt = document.createElement("img"); // création de la balise image
    img_elt.src = articleSolo.imageUrl 
    img_elt.alt = articleSolo.altTxt;
    let item__img_elt = document.querySelector(".item__img"); // sélectionne la div qui va recevoir img.src
    item__img_elt.insertAdjacentElement("afterbegin", img_elt);

    // console.log(img_elt);
    // console.table(item._id);
    // console.log(articleSolo.imageUrl);
    // console.table(item.imageUrl);
    // console.table(articleSolo.altTxt);
    // console.table(item.name);

    // console.log(articleSolo[0].color);
    // console.log(option_elt);
    // for (let i of articleSolo.color) {
    //     option_elt.innerHTML = "";

    // console.table(articleSolo.colors);

    /*
    - injection array color en fonction du produit 
      puis boucle sur la data en sélectionnant le tableau des couleurs
    - cible l'ID du html "select"
    - injection de html option et sa valeur pour l'event au clic
      colorSolo devient la référence des couleurs à afficher en boucle en fonction des tabl[] produit
    */

    option_elt = articleSolo.colors.map ((colorSolo) => {
        
        // let select_value = option.value;
        document.querySelector("#colors").innerHTML += `
        <option value ="${colorSolo}">${colorSolo}</option>;
        `
        // console.log(option_elt);
    }) 
    return select_elt;

};

/* *********************
fonction sélection de couleur à l'input
*/
let selectColor = "";
let colorOk = false;
function getSelectValue(selectId) {
    let select_elt = document.getElementById("colors"); // cible le select color
    
    select_elt.addEventListener('input', (e) => {
        selectColor = e.target.value;
        // console.log(selectColor + " couleur"); 
        if (selectColor != 0) {
            colorOk = true;
            // console.log(selectColor + " cible selectColor " + colorOk + " etat couleur");
            return selectColor, colorOk;
        }
        else {
            colorOk = false;
            // alert(`Veuillez choisir une couleur avant de valider l'ajout de votre article ${articleSolo.name}`);
            // console.log("la couleur vaut null " + colorOk);
            return selectColor, colorOk;
        }
    })
};

// console.log(selectColor + " cible selectColor " + colorOk + " etat couleur");


/* *********************
fonction valueJs = 0
*/
let quantityOk = false;
const valueJs = document.querySelector('#quantity'); // attribution qui pointe vers id de input
// console.log(valueJs.value);
let resultQuantity = "";
let basketQuantity = () => {

    // console.log(valueJs.value);
    
    if (valueJs.value == 0) {
        quantityOk = false;
        alert(`N'oubliez pas de choisir le nombre de ${articleSolo.name} que vous souhaitez avant de l'ajouter au panier.`);
        console.log("ton truc est égal à zéro depuis if");
        console.log(quantityOk);
    }
    else if (valueJs.value > 100) {
        quantityOk = false;
        alert(`Nous sommes désolé de ne pas pouvoir vous vendre ${valueJs.value} ${articleSolo.name}. Nous limitons chaque article à 100 par client...`);
        console.log("plus de 100, alerte au gogole");
        console.log(quantityOk);
    }
    else {
        console.log("retourn valeur depuis le else");
        resultQuantity = valueJs.value;
        quantityOk = true;
        console.log(quantityOk + " : Quantité entree est ok");
        return resultQuantity, quantityOk;
    }
};

// //--------------------------------------------------------------
// // Lecture
// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
async function newArray(arrayBasket) {
    if (arrayBasket == null) {
        arrayBasket = new Array();
        
        return arrayBasket;
    }
};

// console.log(arrayBasket);


// let val = localStorage.getItem("articleJson");
// let articleJson = JSON.parse(val);

let arrayBasket = JSON.parse(localStorage.getItem("produit"));
// let arrayBasket = [];
// -------------------------------------------------------------------------------------------------------
// fonction stokage des données ID / Color / Quantité
async function articleStokage() {
    let articleJson = {
        id : productId,
        color : selectColor,
        quantity : resultQuantity
    }

    if (arrayBasket){
        console.log("ok if pour après création truc muche");
        verifId_localStorage();

        if (colorInArray == true && idInArray == true){
            console.log("couleur " + element.color + " et Id " + element.id + " sont vrai et va permettre de rajouter une quantité");
            console.log("on est dans le deuxième if, donc return de la fonction marche");
            element.quantity = element.quantity + resultQuantity;
            localStorage.getItem(element.quantity)
            console.log(element.quantity);
            // localStorage.setItem(element.id, JSON.stringify(element.quantity));

            // arrayBasket.push(element.id);
            localStorage.setItem("produit", JSON.stringify(arrayBasket));
        }

        else {
            arrayBasket.push(articleJson);
            localStorage.setItem("produit", JSON.stringify(arrayBasket));

        }
    }

    else {
        arrayBasket = [];
        arrayBasket.push(articleJson);
        localStorage.setItem("produit", JSON.stringify(arrayBasket));
        console.log(arrayBasket);
    }
    console.log(articleJson.id + " : articleJson.id apres le else de stockageArticle.");
    console.log(arrayBasket.id + " : arraBasket.id apres le else de stockageArticle.");

    return arrayBasket;
};

// articleStokage();
console.table(arrayBasket);
//-----------------------------------------------------------------------------------------------
// function ClearProductId () {
//     if (productId !== null){
//         productId = "";
//         console.log(productId);
//     }
//     return productId
// };

// let target_arrayId = localStorage.getItem();
// var el = 6; //Elément à rechercher
let cloneObj_ok = false;
async function IfValueInclude() {
    window.addEventListener('click', () => {

        // let target_arrayId = arrayBasket.find(element => {
        //     console.log(" retour de l'id qui a été trrouvé dans ");
        // })
        console.log(productId);
        // methode pour parcourir un tableau et demander un retour précis
        // arrayBasket.forEach(element => {
        //     if (productId = element){
        //         console.log(element.id + " : Cet article ID ce trouve déjà dans le panier");
        //     }
        //     else {
        //         console.log("marche pas ? ou plutôt, l'article ne s'y trouve pas !");
        //     }
        // })

    })
    // console.log(verifId_localStorage);
            
};
//----------------------------
// IfValueInclude();
//----------------------------

// fonction de vérification si iD est déjà présent dans le panier
// const resultIDANDColor = arrayBasket.find();

let colorInArray = false;
let idInArray = false;
async function verifId_localStorage() {
    console.log(productId);


    // methode pour parcourir un tableau et demander un retour précis
    for (element of arrayBasket) {
        console.log(element);

        // return element;

    } 
        // si produit id et couleur sont stocké dans le tableau 
        if (productId === element.id && selectColor === element.color){
            console.log(element.color + " : Cet article ID ce trouve déjà dans le panier");
            alert(`article ${element.id} existe ! ${element.color}`);
            colorInArray = true;
            idInArray = true;
            console.log("product ID = " + productId + " et Selectcolor = " + selectColor);
            console.log("element.id = " + element.id + " et element.color = " + element.color);
            console.log("result quantity = " + resultQuantity + " element.quantity = " + element.quantity);

            // si true id et color
            if (colorInArray == true && idInArray == true){
                console.log("couleur " + element.color + " et Id " + element.id + " sont vrai et va permettre de rajouter une quantité");

                //création et opération quantité

                let newQuantity = "";
                console.log("newQuantity vaut av : " + newQuantity);
                newQuantity = element.quantity + resultQuantity;
                
                
                console.log("newQuantity vaut ap : " + newQuantity);
                console.log("resultQuantity vaut av : " + resultQuantity);
                
                // arrayBasket.push()
                // mémorisation
                localStorage.setItem("produit", JSON.stringify(newQuantity));
                console.log(element.quantity);

                // return newQuantity;
            }
        }

        else {
            console.log("La couleur " + selectColor + "  de l'article ne s'y trouve pas !");
            alert("Aucun article de merde avec une nouvelle couleur !");
            colorInArray = false;
            idInArray = false;

            // arrayBasket.push(articleJson);
            // localStorage.setItem("produit", JSON.stringify(arrayBasket));
        }

        
};

console.log(colorInArray + " valeur de couleur");
console.log(idInArray + " valeur de ID");

//----------------------------------------------------------------------------------------------
console.log(productId + " : id du produit");

// IfValueInclude();

// visuelArticleBasket();
// console.log(arrayBasket[0]);
// addArticleInStock();

// -------------------------------------------------------------------------------------------------------
// Fonction add to cart et envoie de donnée via localStorage avancé
//--------------------------------------------------------------------------------------------------------
// appel de script addToCard

// fonction d'appel script pour ajout au panier
const buttonAddToCart = document.getElementById('addToCart');
getSelectValue(); // renvoie la couleur choisie

// event au click ajout au panier
buttonAddToCart.addEventListener('click', () => {
    basketQuantity(); // fonction qui transmet la quantité d'article choisi
    
    console.table(arrayBasket);
        if (colorOk === true && quantityOk === true) {
            alert(`Vrai Article ${articleSolo.name} ajouté à votre panier !`);
            articleStokage(); // stocke les données objet Json pour le restituer à la lecture sur les autres pages
            // visuelArticleBasket(); // affiche dans la console le tableau article sinon rafraichir la page

            console.table(arrayBasket);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }
        else if (colorOk === false || quantityOk === false) {
            alert(`Veuillez choisir une couleur avant de valider l'ajout de votre article ${articleSolo.name}`);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        else {
            console.log("je suis le else... ERROR 404 ! Prévenez un développeur Web pour réparer cette erreur ");
        }
        return arrayBasket;
});

//--------------------------------------------fonction vide array 
// window.addEventListener('click', () => {
//     arrayBasket.splice(0, 100);
//     localStorage.clear();
//     console.log(arrayBasket);
// });
//--------------------------------------------------------------
let click = 0;

// function Affichetab_test () {
    
//         if (window.onclick && click = true) {
//             console.table(arrayBasket);
//             click = false;

//             return click;
//         }

//         else {
//             console.log("tableau déja présent.");
//         }
// }
//--------------------------------------------------------------
// function test pour afficher le tableau au premier click
// function Affichetab_test () {
    
//     document.body.addEventListener('click', () => {
//         // if (click < 1) {
//         //     console.table(arrayBasket);
//         //     click ++;    
//         // } 
        
//         // else {
//         //     console.log("...");
//         // }

//     }) 
// };

// // Affichetab_test();
// document.addEventListener('DOMContentLoaded', function() {
//     if (arrayBasket == null) {
//         console.log("vaut null array basket");
//         arrayBasket = new Array();
//     }
//     else if (arrayBasket) {
//         console.table(arrayBasket);
//     }
//     return arrayBasket;
// });

// // //--------------------------------------------------------------
// // // Lecture
// articleLinea = localStorage.getItem("obj");
// arrayBasket = JSON.parse(articleLinea);

//-----------------------------------------------------------------


//-----------------------------------------------------------------
// newArray();
//------------------------------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', function() {
//     ClearProductId();
//     });
console.table(arrayBasket);

function calculTest () {
    let nombre1 = "";
    let nombre2 = "";
    let resultTest =""
    resultTest = nombre1 + nombre2

    console.log(resultTest);
    return resultTest; 
} 

window.addEventListener('click', calculTest);