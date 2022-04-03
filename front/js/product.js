// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
/* récupération de id du produit, suite au clicButton de la page index d'un produit */
//------------------------------------------------------------------------------------------------
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id"); // va chercher les paramètres de la route back-end js

//------------------------------------------------------------------------------------------------
// Création des variables 
//------------------------------------------------------------------------------------------------
// variable articleSolo() 
let articleSolo = "";

// Variable displayArticleSolo() 
// let option_elt = document.createElement("option"); // création de l'éléments option
// select_elt = option_elt;

// Variable getSelectValue
let selectColor = "";
let colorOk = false;

// Variable basketQuantity()
let quantityOk = false;
const valueJs = document.querySelector('#quantity'); // attribution qui pointe vers id de input
let resultQuantity = "";

// Variable articleStokage()
let colorInArray = false;
let idInArray = false;
// -------------------- variable qui limite la quantité maximale des article
let maxQuantity = 100;
//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let arrayBasket = JSON.parse(localStorage.getItem("produit"));




//------------------------------------------------------------------------------------------------
/* Lancement des fonctions */
//------------------------------------------------------------------------------------------------
getArticleSolo();
getSelectValue();

// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
//  fonction getArticleSolo
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
//  fonction displayArticleSolo
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
            - injection array color en fonction du produit puis boucle sur la data en sélectionnant le tableau des couleurs
            - cible l'ID du html "select"
            - injection de html option et sa valeur pour l'event au clic
        
    Nb :    colorSolo devient la référence des couleurs à afficher en boucle en fonction de id produit
*/

const contentDisplayArticle = displayArticleSolo;
//------------------------------------------------------------------------------------------------
async function displayArticleSolo(articleSolo) {

    // partie 1
    const title_elt = document.getElementById("title").textContent = articleSolo.name;
    const price_elt = document.getElementById("price").textContent = articleSolo.price;
    const description_elt = document.getElementById("description").textContent = articleSolo.description;
    
    // partie 2
    const img_elt = document.createElement("img"); // création de la balise image
    img_elt.src = articleSolo.imageUrl; 
    img_elt.alt = articleSolo.altTxt;
    let item__img_elt = document.querySelector(".item__img"); // sélectionne la div qui va recevoir img.src
    item__img_elt.insertAdjacentElement("afterbegin", img_elt);

    // partie 3
    /*
    
    */
    // option_elt = articleSolo.colors.map ((colorSolo) => {
        
        for (let colorSolo of articleSolo.colors) {
            let option_elt = document.createElement("option"); // création de l'éléments option
            // let select_value = option.value;
            document.querySelector("#colors").appendChild(option_elt);
            option_elt.textContent = colorSolo;

        // // let select_value = option.value;
        // document.querySelector("#colors").innerHTML += `
        // <option value ="${colorSolo}">${colorSolo}</option>;
        // `
        // console.log(option_elt);
    } 
};

//------------------------------------------------------------------------------------------------
//  fonction sélection de couleur et retourne sa valeur 
//------------------------------------------------------------------------------------------------
/* 
    - Créé une variable temp. qui cible l'ID colors
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
//  fonction quantité envoyé
//------------------------------------------------------------------------------------------------
/*  Vérifie à l'envoie et permet une double sécurité pour que le panier ne recoit pas de quantité incohérente :
    ->  la valeur quantité saisie est = 0 (quantityOk = false)
    ->  la valeur  quantité saisie > 100 (quantityOk = false)
    ->  sinon return booléen quantityOk = true

    NB: A valeur de validation avant post/push sur le local storage.
    NB2: True pemet la suite d'event de la fonction AddToCart
*/ 
//------------------------------------------------------------------------------------------------
let basketQuantity = () => {

    if (valueJs.value == 0) {
        quantityOk = false;
        console.log(quantityOk);
    }

    else if (valueJs.value > 100) {
        quantityOk = false;
        console.log(quantityOk);
    }

    else {
        resultQuantity = parseInt(valueJs.value); //--------------------------
        quantityOk = true;
        console.log(quantityOk + " : Quantité entree est ok");
        return resultQuantity, quantityOk;
    }
};


//------------------------------------------------------------------------------------------------
//  Ecoute sur la quantité entrée par l'tilisateur
//------------------------------------------------------------------------------------------------
/*
    -> Si la quantité ne est différentes de l'expression régulière ci-dessous :
        -   Initialisation quantité à 1
        -   Message d'alert ; rappel des règles d'entrée quantité (no letter/no $*-+*_-/ max number(3)
    -> Sinon si la quantité est > 100
        -   Message d'alert + initialisation quantité maximum à 100
    -> Sinon transmission valeur quantité à la variable resultQuantity

    NB: Portée de cette fonction sur la quantité avant clique ajout panier.
        Pas pas valeur de post/push sur le locale Storage
*/
//------------------------------------------------------------------------------------------------
//  Regex anti null/lettre/symbole/plus de 3 chiffres pour "entrée quantité" du produit
const onlyNumberREGEX = new RegExp("^(null|[0-9]{1,3})$");
//------------------------------------------------------------------------------------------------
valueJs.addEventListener('input', () => {

    if (!valueJs.value.match(onlyNumberREGEX)) {
        valueJs.value = 1;
        alert(`Veuillez respecter les règles suivantes ; 
        * Ne peux pas être vide,
        * Contenir de lettres, 
        * De caractères spéciaux, 
        * Et ne avoir plus de 3 chiffres pour quantité (max 100).`);

        console.log(valueJs.value);
    }

    else if (valueJs.value > 100) {
        alert(`Nous sommes désolé de ne pas pouvoir vous vendre ${valueJs.value} ${articleSolo.name}. Nous limitons chaque article à ${valueJs.value = 100} par client...`);
    }

    else {
        resultQuantity = parseInt(valueJs.value); //--------------------------
    }
})


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

            // si produit trouvé avec id et color pareil
            if (findArticle) {
                console.log(" color trouvé");

                // check quantité + opération ajout
                findArticle.quantity += resultQuantity;
                
                // vérification de la quantité maximale qui check le panier et le modifie à 100/!\
                // exemple : nouvelle quantité = 50 + quantité panier (80) = 130. > nouvelle valueur = 100
                if (findArticle.quantity > maxQuantity) {
                    console.log("je suis supérieur à 100 : " + findArticle.quantity);
                    // alert(`Désolé, votre panier dépasse la quantité maximum pour ce produit. Celui-ci sera donc limité à 100 dans votre panier.`);
                    
                    // réinitialisation à 100, valeur de ma variable déclarée
                    findArticle.quantity = maxQuantity;
                        console.log("je réinitialise à 100 : " + findArticle.quantity);

                        displayPopUp_2();
                    }
                    
                    // voué à disparaitre
                    else {
                        console.log("Je suis inférieur à 100... : " + findArticle.quantity);
                        displayPopUp_1();
                        console.log(" je suis pop 2");
                    }

                // memorisation nouvelle quantité en version json (via stringify, (utilse parse pour le lire en html après))
                localStorage.setItem("produit", JSON.stringify(arrayBasket));
                console.log("result final que je vais post" + resultQuantity);
                
            }
            
            // sinon, si id et color différent, ajout du produit au tableau
            else {
                console.log("je suis un nouvel article, avec le même id mais pas la même color");
                arrayBasket.push(articleJson);
                localStorage.setItem("produit", JSON.stringify(arrayBasket));
                displayPopUp_1();
            }     
            
        } // fin array exist   
        
        // sinon si tableau n'existe pas, le créer et ajouter le premier produit
        else {
            console.log("array dont exist !");
            arrayBasket = [];
            arrayBasket.push(articleJson);
            localStorage.setItem("produit", JSON.stringify(arrayBasket));
            console.log(arrayBasket);

            displayPopUp_1();
            console.log(" je suis pop 3");
    }
    return 
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
*/
//--------------------------------------------------------------------------------------------------------
const buttonAddToCart = document.getElementById('addToCart');
// event au click ajout au panier
buttonAddToCart.addEventListener('click', () => {
    basketQuantity(); // renvoie la quantité d'article choisi
    getSelectValue(); // renvoie la couleur choisie
    
    console.table(arrayBasket);
        if (colorOk === true && quantityOk === true) {
            // alert(`Vrai Article ${articleSolo.name} ajouté à votre panier !`); // popup rapide d'information à améliorer
            articleStokage(); // coeur de l'action
            console.table(arrayBasket);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        else if (colorOk === false && quantityOk === true) {
            alert(`Veuillez choisir une couleur avant de valider l'ajout de votre article ${articleSolo.name}`);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        else if (colorOk === true && quantityOk === false) {
            alert(`Veuillez choisir une quantité avant de valider l'ajout de votre article ${articleSolo.name}`);
            console.log(" Etat couleur : " + colorOk );
            console.log(" Etat quantité : " + colorOk );
        }

        else {
            alert(`Veuillez choisir une couleur et une quantité avant de valider l'ajout de votre article ${articleSolo.name}`);
        }
        return arrayBasket;
});

// -------------------------------------------------------------------------------------------------------
//  fonction display PopUp version 1 et version 2
/*
    (i) Deux fonctions popUp indépendante pour afficher un retour après clic et vérification général (ref articleStokage())
    ->  Version 1
        -   affiche un message classique informant de l'ajout de l'article (quantity/name/color)
    
    ->  Version 2
        -   affiche un message secondaire prenant en compte la quantité maximal du produit enregistré
            dans le panier

    Nb: Présent (3x) dans articleStokage() pour s'afficher après vérification multiple 
*/
//--------------------------------------------------------------------------------------------------------
//  Version 1
//  Affiche commande normale
const displayPopUp_1 =() => {
    if(window.confirm(`Votre commande de ` +  resultQuantity + ` ${articleSolo.name} de couleur ` + selectColor + ` est ajoutée au panier.
Pour consulter votre panier, cliquez sur "OK".
Sinon sur "ANNULER" pour poursuivre votre commande.`))
        {
            window.location.href ="cart.html";
        }    
};

//  Version 2
//  Affiche commande secondaire qui prend en compte la quantité maximal dépassée
const displayPopUp_2 =() => {
    if(window.confirm(`Votre commande de ${articleSolo.name} de couleur ${selectColor} a atteint la quantité maximale (100).
Pour consulter votre panier, cliquez sur "OK".
Sinon sur "ANNULER" pour poursuivre votre commande.`))
        {
            window.location.href ="cart.html";
        }
};

console.table(arrayBasket);
