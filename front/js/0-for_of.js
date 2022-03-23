// -------------------------------------------------------------
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id"); // va chercher les paramètres de la route back-end js

let articleSolo = "";

//--------------------------------------------------------------
// newArray();
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
        resultQuantity = parseInt(valueJs.value); //--------------------------
        quantityOk = true;
        console.log(quantityOk + " : Quantité entree est ok");
        return resultQuantity, quantityOk;
    }
};


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
let colorInArray = false;
let idInArray = false;

let arrayBasket = JSON.parse(localStorage.getItem("produit"));
// let arrayBasket = [];
// -------------------------------------------------------------------------------------------------------
// fonction stokage des données ID / Color / Quantité

async function articleStokage() {
    console.log("lancement de la function articleStockage()");
    let articleJson = {
        id : productId,
        color : selectColor,
        quantity : resultQuantity
    }
    
    // let idAndColor_ok = false;
    // c'est ici qu'il faut que je fixe mon intéret pour changer le... /!\
    if (arrayBasket){
        console.log("array existe ! passse à la condition suivante");          
        console.log(productId);

        let findSameProduct = false;
        // parcours un tableau
        for (const element of arrayBasket) {
            console.table(element);
        //  return element   
         
         
            if (findSameProduct == false) {
                console.log(element);
                console.log(element.index);
                
                //vérification fonctionnelle de id et color dans le tableau et saisie
                if (productId === element.id) {
                    console.log("id trouvé dans le tableau");
                    console.log("");
                    // findSameProduct = true;
                    
                    if (selectColor === element.color) {
                        findSameProduct = true;
                        // console.log("comparatif ok id/color user vs id/color element: array[index].color = " + arrayBasket[index].color + element.color);
                        // // console.log("id and color = " + idAndColor_ok);
                         console.log(" color trouvé");
                         console.log(element.id);

                        // check quantité + opération ajout
                        console.log("quantité result au post new = " + resultQuantity + " et quantité stocké dans arraybasket quantity = " + element.quantity);

                        // arrayBasket.quantity = element.quantity + resultQuantity;
                        element.quantity += resultQuantity; 
                        
                        // memorisation nouvelle quantité
                        localStorage.setItem("produit", JSON.stringify(arrayBasket));
                        console.log("result final que je vais post" + resultQuantity);
                        
                    }
                    // si id ok mais couleur diff
                    else {
                        findSameProduct = true;
                        console.log("je suis un nouvel article, avec le même id mais pas la même color");
                        console.log(element.index);
                        // console.log("je suis donc le else if id ok mais couleur dif");
                        arrayBasket.push(articleJson);
                        localStorage.setItem("produit", JSON.stringify(arrayBasket));
                        
                    } 
                    
                }    // fin prod false

                // produit id diff et new color
                else {
                    console.log("je suis un nouveau produit, avec un ID et un color nouveau");
                    console.log(element.index);
                    // push normal d'un article si arrayBasket existe
                    // findSameProduct = true;
                    console.log("nouveau produit ajouté quand le if id et color est faux" + resultQuantity);
                    console.log("je suis donc le else if id ok mais couleur dif");
                    arrayBasket.push(articleJson);
                    localStorage.setItem("produit", JSON.stringify(arrayBasket));
                }
                    
            } // fin de if id ok
                
        } // fin de boucle       

    } // fin array exist   
    
    else {
        console.log("array dont exist !");
        arrayBasket = [];
        arrayBasket.push(articleJson);
        localStorage.setItem("produit", JSON.stringify(arrayBasket));
        console.log(arrayBasket);
    }
    return 
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

//--------------------------------------------------------------
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
//-----------------------------------------------------------------
//-----------------------------------------------------------------
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
}; 

// window.addEventListener('click', calculTest);