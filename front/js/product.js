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
// variable articleSolo 
let articleSolo = "";

// Variable getSelectValue() (color)
let selectColor = "";
let colorOk = false;

// Variable CartQuantity() 
let quantityOk = false;
const valueJs = document.querySelector('#quantity'); // attribution qui pointe vers id de input
let resultQuantity = "";

// Variable articleStokage()
let colorInArray = false;
let idInArray = false;
// -------------------- variable qui limite la quantité maximale des articles
let maxQuantity = 100;

//------------------------------------------------------------------------------------------------
// Variable lecture du stringify articleJson/articleSolo/produit
let arrayCart = JSON.parse(localStorage.getItem("produit"));

// Variable pour afficher la qtt panier et calucul avec entrée qtt utilisateur (displayPopUp2)
let displayMaxQtt = "";
//------------------------------------------------------------------------------------------------
/* Lancement des fonctions */
//------------------------------------------------------------------------------------------------
getArticleSolo();
getSelectValue();


// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
//  fonction getArticleSolo()
//------------------------------------------------------------------------------------------------
/* 
    Info : Cette fonction permet de récupérer les données de l'api qui contient les information du produits à afficher.
        -   Fetch + url
        -   Promesse à laquelle j'attribue les données dataAPI dans la variable articleSolo
        -   Renvoie fonction displayArticle avec pour param "articleSolo"
        -   Catch error si l'API n'est pas joignable
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
//  fonction displayArticleSolo()
//------------------------------------------------------------------------------------------------
/* 
    Info : fonction qui va permettre d'afficher les informations récupérées pour l'article/ID
        -   Prend en paramètre "articleSolo"
        -   Création variable temp qui créé et récupère la valeur contenu dans le dataAPI(articleSolo)

            Partie 1
                ->  Titre
                ->  Prix
                ->  Description

            Partie 2
                ->  Image + Alt 

            Partie 3
                <=> BOUCLE sur la data.colors en sélectionnant le tableau des couleurs
                    -   Option Couleurs
*/
//------------------------------------------------------------------------------------------------
async function displayArticleSolo(articleSolo) {

    // partie 1
    const title_elt = document.getElementById("title").textContent = articleSolo.name;
    const price_elt = document.getElementById("price").textContent = articleSolo.price;
    const description_elt = document.getElementById("description").textContent = articleSolo.description;
    
    // partie 2
    const img_elt = document.createElement("img"); 
    img_elt.src = articleSolo.imageUrl; 
    img_elt.alt = articleSolo.altTxt;
    let item__img_elt = document.querySelector(".item__img");
    item__img_elt.insertAdjacentElement("afterbegin", img_elt);

    // partie 3 (color)
    for (let colorSolo of articleSolo.colors) {
        let option_elt = document.createElement("option"); // création de l'éléments option
        document.querySelector("#colors").appendChild(option_elt);
        option_elt.textContent = colorSolo;
    } 
};


//------------------------------------------------------------------------------------------------
//  fonction getSelectValue()
//------------------------------------------------------------------------------------------------
/* 
    Info :  Vérifie et écoute le choix utilisateur des couleurs pour un Kanap.
            En fonction de colorOk, on peut valider l'ajout au panier (lien addToCart())
    
        -   Cilble l'élément/ID colors
        |> Ecoute entrée utilisateur, sur l'élément DOM select_elt, 
            -   Attribut de la valeur
                ->  SI la selection est diffférente de "0", couleurOK vaut vrai 
                <-  SINON couleurOk vaut faux
*/
//------------------------------------------------------------------------------------------------
function getSelectValue(selectId) {
    let select_elt = document.getElementById("colors"); // cible le select color
    select_elt.addEventListener('input', (e) => {
        selectColor = e.target.value;

        if (selectColor != 0) {
            colorOk = true;
            return selectColor, colorOk;
        }
        else {
            colorOk = false;
            return selectColor, colorOk;
        }
    })
};


//------------------------------------------------------------------------------------------------
//  Ecoute sur la quantité entrée par l'utilisateur
//------------------------------------------------------------------------------------------------
/*
    Info :  Portée de cette fonction sur la quantité avant clique ajout panier.
            Pas valeur de post/push sur le locale Storage. 
            Vérifie rigueur d'entrée utilisateur.

        ->  SI la quantité est différentes de l'expression régulière ci-dessous :
            -   Initialisation quantité à 1
            -   Message d'alert ; rappel des règles d'entrée quantité (no letter/no $*-+*_-/ max number(3)
        <- SINON SI la quantité est > 100
            -   Message d'alert + initialisation quantité maximum à 100
        <- SINON transmission de la valeur quantité à la variable resultQuantity
*/
//------------------------------------------------------------------------------------------------
//  Regex anti null/lettre/symbole/plus de 3 chiffres pour "entrée quantité" du produit
const onlyNumberREGEX = new RegExp("^([0-9]{1,3})$");
//------------------------------------------------------------------------------------------------
valueJs.addEventListener('input', () => {

    if (!valueJs.value.match(onlyNumberREGEX)) {
        valueJs.value = 1;
        alert(`Veuillez respecter les règles suivantes ; 
        * Le champs ne peux pas être vide,
        * Contenir de lettres, 
        * De caractères spéciaux, 
        * Et ne pas avoir plus de 3 chiffres pour quantité maximum (100).`);

        console.log(valueJs.value);
    }

    else if (valueJs.value > 100) {
        alert(`Nous sommes désolé de ne pas pouvoir vous vendre ${valueJs.value} ${articleSolo.name}. Nous limitons chaque article à ${valueJs.value = 100} par client...`);
    }

    else {
        resultQuantity = parseInt(valueJs.value); //--------------------------
    }
})

//------------------------------------------------------------------------------------------------
//  fonction cartQuantity
//------------------------------------------------------------------------------------------------
/*  
    Info:   Vérifie et valide l'envoie la quantité.
            Permet une double sécurité pour que le panier ne recoit pas de quantité incohérente.
                ->  SI la valeur quantité saisie est = 0 ou sup. à 100 (quantityOk = false)
                <-  SINON return (quantityOk = true) pour addToCart()
*/ 
//------------------------------------------------------------------------------------------------
let cartQuantity = () => {

    if (valueJs.value == 0 || valueJs.value > 100) {
        quantityOk = false;
        console.log(quantityOk);
    }

    else {
        quantityOk = true;
        resultQuantity = parseInt(valueJs.value); //--------------------------
        console.log(quantityOk + " : Quantité entree est ok");
        return resultQuantity, quantityOk;
    }
};


// -------------------------------------------------------------------------------------------------------
//  fonction articleStorage()
// -------------------------------------------------------------------------------------------------------
/*  
    Info:   stokage des données ID / Color / Quantités au local storage

        *   Création objet (id, color et quantity)
            ->  IF tableau existe
                <Mtd> FIND. id/color panier ET id/color id/color de l'article entrant 

                    ->  SI trouvé couleur du tableau vaut la sélection couleur et id du produit (resultat de findArticle)
                        -   Ajout nouvelle quantité sur celle trouvée
                        Exp: nouvelle quantitée = 50 + quantitée panier (80) = 130. > nouvelle valeur = 100
                        
                            ->  SI l'entrée et panier dépasse 100 article
                                -   Alert Msg pop Up 2
                                -   Réinitialisation article totale à la valeur de maxQuantity(100)
                                
                            <-  SINON commande valide avec Window.Confirm depuis fonction PopUp 1
                        -   Mise à jour locale storage en JSON pour la nouvelle valeur de quantité d'article

                    <-  SINON push au tableau un article qui n'a le même ID mais pas la même couleur

            <-  SINON Créer un tableau vide et push l'article avec Msg pop Up 1
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
    if (arrayCart){
        console.log("array existe ! passse à la condition suivante");          
        console.log(productId);

        // initialiser le .find qui va trouver l'article
        const findArticle = arrayCart.find((element) => element.id === productId && element.color === selectColor);

            // si produit trouvé avec id et color pareil
            if (findArticle) {
                console.log(" color trouvé");

                // check quantité + opération ajout
                findArticle.quantity += resultQuantity;
                
                // vérification de la quantité maximale qui check le panier et le modifie à 100/!\
                
                if (findArticle.quantity > maxQuantity) {
                    console.log("je suis supérieur à 100 : " + findArticle.quantity);
                    // alert(`Désolé, votre panier dépasse la quantité maximum pour ce produit. Celui-ci sera donc limité à 100 dans votre panier.`);
                    displayMaxQtt = findArticle.quantity;
                    
                    // réinitialisation à 100, valeur de ma variable déclarée
                    findArticle.quantity = maxQuantity;
                        console.log("je réinitialise à 100 : " + findArticle.quantity);
                        displayPopUp_2();
                    }
                    
                    // Commande ok
                    else {
                        console.log("Je suis inférieur à 100... : " + findArticle.quantity);
                        displayPopUp_1();
                        console.log(" je suis pop 1");
                    }

                // memorisation nouvelle quantité en version json (via stringify, (utilse parse pour le lire en html après))
                localStorage.setItem("produit", JSON.stringify(arrayCart));
                console.log("result final que je vais post" + resultQuantity);
            }
            
            // sinon, si id et color différent, ajout du produit au tableau
            else {
                console.log("je suis un nouvel article, avec le même id mais pas la même color");
                arrayCart.push(articleJson);
                localStorage.setItem("produit", JSON.stringify(arrayCart));
                displayPopUp_1();
            }     
            
        } // fin array exist   
        
        // sinon si tableau n'existe pas, le créer et ajouter le premier produit
        else {
            console.log("array dont exist !");
            arrayCart = [];
            arrayCart.push(articleJson);
            localStorage.setItem("produit", JSON.stringify(arrayCart));
            console.log(arrayCart);

            displayPopUp_1();
            console.log(" je suis pop 3");
    }
    // return 
};

console.log(colorInArray + " valeur de couleur");
console.log(idInArray + " valeur de ID");
console.log(productId + " : id du produit");

//--------------------------------------------------------------------------------------------------------
//  Fonction addToCart()
//--------------------------------------------------------------------------------------------------------
/*
    Info:   Au clic, lance plusieurs vérifications avant de pemerttre l'ajout d'article
            |> Ecoute au clic qui pointe sur le boutton "Ajouter au panier"
                -   Lancement des fonctions pour check :
                    * Quantité
                    * Couleur choisie
                    
            ->  SI Couleur et quantité OK
                -   Appel du script articleStorage(), coeur de l'ajout article pour :
                    * D'autres vérifications
                    * Et Push
                    
                <-  SINON SI couleur "false" et quantité "true"
                    -   Alert Msg spécifique
                
                <-  SINON SI couleur "true" et quantité "false"
                    -   Alert Msg spécifique

            <-  SINON
                -   Alert Msg spécifique mentionant false pour les deux
*/
//--------------------------------------------------------------------------------------------------------
const buttonAddToCart = document.getElementById('addToCart');
// event au click ajout au panier
buttonAddToCart.addEventListener('click', () => {
    cartQuantity(); // renvoie la quantité d'article choisi
    getSelectValue(); // renvoie la couleur choisie
    
    console.table(arrayCart);
        if (colorOk === true && quantityOk === true) {
            // alert(`Vrai Article ${articleSolo.name} ajouté à votre panier !`); // popup rapide d'information à améliorer
            articleStokage(); // coeur de l'action
            console.table(arrayCart);
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
        return arrayCart;
});

// -------------------------------------------------------------------------------------------------------
//  fonction displayPopUp version 1 et version 2
// -------------------------------------------------------------------------------------------------------
/*
    Info:   Deux fonctions popUp indépendante pour afficher un message avec des informations du produit/quantité
            Présent (3x) dans articleStokage() pour s'afficher après vérification multiples.
        ->  Version 1
        -   affiche un message classique informant de l'ajout de l'article (quantity/name/color)
    
        ->  Version 2
        -   affiche un message secondaire prenant en compte la quantité maximal du produit enregistré
            dans le panier

*/
//--------------------------------------------------------------------------------------------------------
//  Version 1
//  Affiche commande normale
const displayPopUp_1 =() => {
    if(window.confirm(`Votre commande de ${resultQuantity} ${articleSolo.name} de couleur ${selectColor} est ajoutée au panier.

Pour consulter votre panier, cliquez sur "OK".
Sinon sur "ANNULER" pour poursuivre votre commande.`))
        {
            window.location.href ="cart.html";
        }    
};

//  Version 2
//  Affiche commande secondaire qui prend en compte la quantité maximal dépassée
const displayPopUp_2 =() => {
    if(window.confirm(`Votre commande de ${articleSolo.name} de couleur ${selectColor} atteint ${displayMaxQtt} articles et dépasse la quantité maximale(100).
Il sera limité à 100 dans votre panier.

Pour consulter votre panier, cliquez sur "OK".  
Sinon sur "ANNULER" pour poursuivre votre commande.`))
        {
            window.location.href ="cart.html";
        }
};

console.table(arrayCart);
