//------------------------------------------------------------------------------------------------
/* récupération de id du produit, suite au clic sur la page index  sur un produit */
//------------------------------------------------------------------------------------------------
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id"); // va chercher les paramètres de la route back-end js

//------------------------------------------------------------------------------------------------
/* Création des variables */
//------------------------------------------------------------------------------------------------
// variable articleSolo() 
let articleSolo = "";

// Variable displayArticleSolo() 
let option_elt = document.createElement("option"); // création de l'éléments option
select_elt = option_elt;

// Variable getSelectValue
let selectColor = "";
let colorOk = false;

// Variable basketQuantity()
let quantityOk = false;
const valueJs = document.querySelector('#quantity'); // attribution qui pointe vers id de input
let resultQuantity = "";

// variable articleStokage()
let colorInArray = false;
let idInArray = false;

//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let arrayBasket = JSON.parse(localStorage.getItem("produit"));

//------------------------------------------------------------------------------------------------
/* Lancement des fonctions */
//------------------------------------------------------------------------------------------------
getArticleSolo();
getSelectValue();

//------------------------------------------------------------------------------------------------
//  function getArticleSolo
//------------------------------------------------------------------------------------------------
/* 
    - Cette fonction permet de récupérer les données de l'api qui contient les produit à afficher.
    - Fetch + url
    - Promesse à laquelle j'attribue les données dataAPI dans la variable articleSolo
    - renvoie fonction displayArticle avec pour param "articleSolo"
    - ajout catch error si l'api n'est pas joignagle
*/
//------------------------------------------------------------------------------------------------
async function getArticleSolo() {
    console.log(productId);
    await fetch("http://localhost:3000/api/products/" + productId) 
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

//------------------------------------------------------------------------------------------------
//  function displayArticleSolo
//------------------------------------------------------------------------------------------------
/* 
    - Fonction qui va permettre d'afficher les informations récupérées concernant l'article ID
    - Prend en paramètre "articleSolo"
    - création variable temp qui créé et récupère la valeur contenu dans le dataAPI(articleSolo)

        partie 1
        -> Titre
        -> Prix
        -> description

        partie 2
        -> image + alt 

        partie 3
        -> initialisation des couleurs pour chaue article
*/
//------------------------------------------------------------------------------------------------
async function displayArticleSolo(articleSolo) {

    // partie 1
    const title_elt = document.getElementById("title").innerHTML = articleSolo.name;
    const price_elt = document.getElementById("price").innerHTML = articleSolo.price;
    const description_elt = document.getElementById("description").innerHTML = articleSolo.description;
    
    // partie 2
    const img_elt = document.createElement("img"); // création de la balise image
    img_elt.src = articleSolo.imageUrl 
    img_elt.alt = articleSolo.altTxt;
    let item__img_elt = document.querySelector(".item__img"); // sélectionne la div qui va recevoir img.src
    item__img_elt.insertAdjacentElement("afterbegin", img_elt);

    // partie 3
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

//------------------------------------------------------------------------------------------------
//  fonction sélection de couleur et retourne sa valeur 
//------------------------------------------------------------------------------------------------
/* 
    - Créé une variable temp qui cible l'ID colors
    - Sur intéraction du clic, sur l'élément html select_elt, 
        -> - attribue la valeur couleur depuis la data (e)
            -> lance condition si la selection couleur est vrai ou fausse;
*/
//------------------------------------------------------------------------------------------------
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
            return selectColor, colorOk;
        }
    })
};

//------------------------------------------------------------------------------------------------
//  fonction quantité saisie
//------------------------------------------------------------------------------------------------
/*  Vérifie :
    ->  - la valeur quantité saisie est = 0 (quantityOk = false)
        - la valeur  quantité saisie > 100 (quantityOk = false)
        - sinon return booléen quantityOk = true
*/ 
//------------------------------------------------------------------------------------------------
let basketQuantity = () => {

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
//  fonction stokage des données ID / Color / Quantité
// -------------------------------------------------------------------------------------------------------
/*  
* fonction appelé dans...
    - Création objet (id, color et quantity)
        ->  vérification si tableau existe, sinon le créer 
            ->  initialiser la recherche .find (si id et couleur du tableau vaut la sélection couleur et id du produit)
                ->  si findArticle est vrai
                -   nouvelle valeur quantité, sinon créé une nouvelle entrée au tableau existant
*/ 
// -------------------------------------------------------------------------------------------------------
async function articleStokage() {
    console.log("lancement de la function articleStockage()");
    let articleJson = {
        id : productId,
        color : selectColor,
        quantity : resultQuantity
    }
    // Si tableau existe
    if (arrayBasket){
        console.log("array existe ! passse à la condition suivante");          
        console.log(productId);

        // initialiser le .find qui va trouver l'article
        const findArticle = arrayBasket.find((element) => element.id === productId && element.color === selectColor);
            console.log("article coloret id trouvé");

            // si produit trouvé avec id et color pareil
            if (findArticle) {
                console.log(" color trouvé");

                // check quantité + opération ajout
                // console.log("quantité result au post new = " + resultQuantity + " et quantité stocké dans arraybasket quantity = " + findArticle.quantity);
                findArticle.quantity += resultQuantity; 
                
                // memorisation nouvelle quantité en version json (via stringify, (utilse parse pour le lire en html après))
                localStorage.setItem("produit", JSON.stringify(arrayBasket));
                console.log("result final que je vais post" + resultQuantity);
                
            }

            // sinon, si id et color différent, ajout du produit au tableau
            else {
                console.log("je suis un nouvel article, avec le même id mais pas la même color");
                arrayBasket.push(articleJson);
                localStorage.setItem("produit", JSON.stringify(arrayBasket));
            }     

    } // fin array exist   

    // sinon si tableau n'existe pas, le créer et ajouter le premier produit
    else {
        console.log("array dont exist !");
        arrayBasket = [];
        arrayBasket.push(articleJson);
        localStorage.setItem("produit", JSON.stringify(arrayBasket));
        console.log(arrayBasket);
    }
};

console.log(colorInArray + " valeur de couleur");
console.log(idInArray + " valeur de ID");
console.log(productId + " : id du produit");

// -------------------------------------------------------------------------------------------------------
// Fonction add to cart et envoie de donnée via localStorage avancé
//--------------------------------------------------------------------------------------------------------
/*
    A l'évènement du clic qui cible id "buttonAddToCart" réalise :
        -   appel du script qui vérifie la quantité entrée de l'utilisateur
            -> si variable boo color et quantité sont true
                -   appel du script articleStorage(), coeur de l'ajout article en fonction de ;
                    tableau existe, id et color idem à choix utilisateur 
                - sinon popup d'information et var boo = false

    nb : ajouter popup confirmation qui prend en compte trois choix :
        * rester sur cette et choisir une autre couleur/quantié pour l'article
        * revenir sur la page des produits (index)
        * se rendre au panier (possibilité de ++/-- produit ou de le supprimer et formulaire)

*/
//--------------------------------------------------------------------------------------------------------
const buttonAddToCart = document.getElementById('addToCart');
// event au click ajout au panier
buttonAddToCart.addEventListener('click', () => {
    basketQuantity(); // renvoie la quantité d'article choisi
    getSelectValue(); // renvoie la couleur choisie
    
    console.table(arrayBasket);
        if (colorOk === true && quantityOk === true) {
            alert(`Vrai Article ${articleSolo.name} ajouté à votre panier !`); // popup rapide d'information à améliorer
            articleStokage(); // coeur de l'action

            console.table(arrayBasket);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        else {
            alert(`Veuillez choisir une couleur avant de valider l'ajout de votre article ${articleSolo.name}`);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        return arrayBasket;
});

console.table(arrayBasket);
