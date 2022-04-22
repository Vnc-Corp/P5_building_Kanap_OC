// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
//  Importation panier + affichage console
//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let productLocalStorage = JSON.parse(localStorage.getItem("produit"));

//affichage du panier
console.table(productLocalStorage);

// variable fonction calcul quantité total des produits
let totalQuantity = 0;

// variable fonction calcul prix total des produits
let totalPrice = 0;

//------------------------------------------------------------------------------------------------
//  Appel de fonctions
//------------------------------------------------------------------------------------------------
displayCartHTML(); // Affiche le panier dans sa totalité sur le DOM


//------------------------------------------------------------------------------------------------
//  fonction displayCartHTML()
//------------------------------------------------------------------------------------------------
/* 
    Info: Affiche les différentes informations récupérées depuis le local Storage.
          
          - Transfert dans une variable la fonction qui récupère les données de l'API
          (permet d'afficher les données non transmisent via local Storage afin de préserver sa sécurité)

          ->  SI le local storage existe
              - Appel direfférentes fonctionS avec des paramètres.
          <-  SINON afficher Msg 
*/
//------------------------------------------------------------------------------------------------
async function displayCartHTML () {
  const productInfo = await getProduct_info();
  if (productLocalStorage) {
    displayproductInfo(productInfo, productLocalStorage);
    calculQuantity(productLocalStorage);
    calculPrice(productLocalStorage, productInfo);
    quantityModifcation(productLocalStorage);
    ProductDelete(productLocalStorage);

    console.log("Panier existe");
  }  
  
  else {
    console.log("Panier VIDE");
    document.getElementById("cart__items").innerHTML += `
    <h2 id="center">...est vide.</h2>
    `
  }
};


//------------------------------------------------------------------------------------------------
//  Fetch - récupération API
//------------------------------------------------------------------------------------------------
async function getProduct_info() {
  return fetch("http://localhost:3000/api/products") 
  .then(function(httpBodyResponse){
    return httpBodyResponse.json()  
  })
  .then(function (response){
    return response; // retourne les données pour devenir exploitable en dehors
  })
  .catch(function(error) {
    alerte(error) // retourne erreur 404 si on n'arrive pas à atteindre le serveur
  })
};


//------------------------------------------------------------------------------------------------
//  Fonction DisplayProductInfo
//------------------------------------------------------------------------------------------------
/* 
    Info: Affiche les éléments de chaque produit disponible dans le panier.
        
          <Mdt> .map (BOUCLE) sur les produits présents dans le local Storage.
            <Mtd> .find (RECHERCHE) sur le les données de l'api avec pour condition que les ID
            des produits en local storage et API soient vrai.
            Exemple : Id Produit local est égale à l'Id de l'API 
            Je peux donc afficher les informations du produit en l ocal storage ainsi que ses informations
            disponible via l'API. 

              ->  SI ID trouvé, Création des balises/class/etc... à afficher au DOM
              <-  SINON alert Msg error, pas accès au local storage
*/
//------------------------------------------------------------------------------------------------
async function displayproductInfo(productInfo, productLocalStorage) {
  
  const productCartLocal = productLocalStorage.map((cartDonnee) => {
    const find_info_ID = productInfo.find((cartInfo) => cartInfo._id === cartDonnee.id);

      // initialiser le .find qui va trouver l'article
      if (find_info_ID) {
        // console.log("IF - ID du Produit du local : " + find_info_ID._id);
        // console.log("! trouvé ! dans find local storage " + cartDonnee.id);
        
        // Ajout Article
        let productArticle = document.createElement("article");
        document.querySelector("#cart__items").appendChild(productArticle);
        productArticle.classList.add("cart__item");
        productArticle.setAttribute('data-id', cartDonnee.id);
        productArticle.setAttribute('data-color', cartDonnee.color);
        
        // Ajout div pour img
        let productDiv_img = document.createElement("div");
        productArticle.appendChild(productDiv_img);
        productDiv_img.classList.add("cart__item__img");

        // Ajout image et alt
        let productImg = document.createElement("img");
        productDiv_img.appendChild(productImg);
        productImg.src = find_info_ID.imageUrl;
        productImg.alt = find_info_ID.altTxt;

        // Ajout div qui contiendra nom, couleur et prix du produit
        let productDiv_content = document.createElement("div");
        productArticle.appendChild(productDiv_content);
        productDiv_content.classList.add("cart__item__content");

        // Ajout div qui contiendra nom, couleur et prix du produit
        let productDiv_content_description = document.createElement("div");
        productDiv_content.appendChild(productDiv_content_description);
        productDiv_content_description.classList.add("cart__item__content__description");

        //ajout nom du produit
        let producName = document.createElement("h2");
        productDiv_content_description.appendChild(producName);
        producName.textContent = find_info_ID.name;

        // Ajout couleur du produit
        let productColor = document.createElement("p");
        productDiv_content_description.appendChild(productColor);
        productColor.textContent = cartDonnee.color;

        // Ajout prix du produit
        let productPrice = document.createElement("p");
        productDiv_content_description.appendChild(productPrice);
        productPrice.textContent = find_info_ID.price + " €";

        // Ajout div qui contiendra le se div de setting quantity
        let productDiv_content_setting = document.createElement("div");
        productDiv_content.appendChild(productDiv_content_setting);
        productDiv_content_setting.classList.add("cart__item__content__settings");

        // Ajout div qui contiendra l'ajout/diminution dynamique du nombre d'article/produit
        let productDiv_content_setting_quantity = document.createElement("div");
        productDiv_content_setting.appendChild(productDiv_content_setting_quantity);
        productDiv_content_setting_quantity.classList.add("cart__item__content__settings_quantity");

        // Ajout du texte avec valeur de la quantité
        let productQuantity_text = document.createElement("p") ;
        productDiv_content_setting_quantity.appendChild(productQuantity_text);
        productQuantity_text.textContent = "Qté : ";

        // Ajout input avec valeur modifiable (ajout/diminution)
        let productQuantity = document.createElement("input");
        productDiv_content_setting_quantity.appendChild(productQuantity);
        productQuantity.classList.add("itemQuantity");
        productQuantity.setAttribute ("type", "number");
        productQuantity.setAttribute ("min", "1");
        productQuantity.setAttribute ("max", "100");
        productQuantity.setAttribute ("name", "itemQuantity");
        productQuantity.setAttribute ("value", cartDonnee.quantity);

        // Ajout div qui contiendra la possibilité de supprimer un produit
        let productDiv_content_setting_delete = document.createElement("div");
        productDiv_content_setting.appendChild(productDiv_content_setting_delete);
        productDiv_content_setting_delete.classList.add("cart__item__content__settings__delete");

        // Ajout du p qui assumera l'action de suprrimer
        let productDelete = document.createElement("p");
        productDiv_content_setting_delete.appendChild(productDelete);
        productDelete.classList.add("deleteItem");
        productDelete.textContent = "Suprrimer";
        
      console.log(" ...............................");
      
    }

    else {
      alert(`ERROR : Impossible de vérifier les ID de API : ${cartInfo._id} et de localStorage : ${cartDonnee.id}`)
      console.log(`ERROR : Impossible de vérifier les ID de API : ${cartInfo._id} et de localStorage : ${cartDonnee.id}`);
    }
  }) // fin .map       
};


//------------------------------------------------------------------------------------------------
//  Fonction calcul total des quantités
//------------------------------------------------------------------------------------------------
/*  
    Info : Initialise le calcul de la quantité des produits dans son ensemble.

          ->  SI les produits existent (local storage ne vaut pas null/empty)
              <=> BOUCLE pour chaque article présent dans le tableau
                  - Ajoute à la variable total la quantité de chaque produit
                  - Pointe vers l'élément du DOM qui affichera la valeur totale des quantités
          <- SINON Alert Msg Error "locale storage inaccessible"
*/
//------------------------------------------------------------------------------------------------
function calculQuantity(productLocalStorage) {
  // console.log("function calcul lancé");
  if (productLocalStorage) {
    // console.log("local storage du if lancé");

    productLocalStorage.forEach(el => {
      totalQuantity += el.quantity;
        
      // console.log(el.quantity);
      document.getElementById("totalQuantity").textContent = totalQuantity;

      // console.log(" ...............................");
    });
  } 
  
  else {
    alert(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`)
    console.log(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`);
  }
}


//------------------------------------------------------------------------------------------------
//  Fonction calculPrice()
//------------------------------------------------------------------------------------------------
/*
    Info : Initialise la somme des produits dans son ensemble.

          ->  SI les produits existent (local storage ne vaut pas null/empty)
              <=> BOUCLE pour chaque article présent dans le tableau
                <Mtd> .find (RECHERCHE) sur le les données de l'api avec pour condition que les ID
                des produits en local storage et API soient vrai.
                  - Ajoute à la variable total le prix de chaque produit x leur quantités(LStorage)
                  - Pointe vers l'élément du DOM qui affichera la somme total 

          <- SINON Alert Msg Error "locale storage inaccessible"
*/
//------------------------------------------------------------------------------------------------
function calculPrice(productLocalStorage, productInfo) {

  if (productLocalStorage) {
    productLocalStorage.forEach(cartDataPriceQT => {
      const findPrice_ID = productInfo.find((cartPriceInfo) => cartPriceInfo._id === cartDataPriceQT.id);

      if (findPrice_ID) {
        totalPrice += cartDataPriceQT.quantity * findPrice_ID.price; 
        document.getElementById("totalPrice").textContent = totalPrice;
      }

    }); // fin forEach
  } 
  
  else {
    alert(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`)
    console.log(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`);
  }
};


//------------------------------------------------------------------------------------------------
//  Fonction quantityModification()
//------------------------------------------------------------------------------------------------
/* 
  Info: Prend en compte la modification des quantités(incré/décré-mentation) et impose un regex pro-chiffre. 

      - Pointe la classe sur laquelle on récupère l'information quantité.valeur du DOM
        <=> BOUCLE sur la valeur/quantité des différents produits du panier
            |>  ECOUTE 0 (input)
              - Récupération des entrées quantité des utilisateurs pour chaque produit dans une variable temp.

          ->  SI la valeur quantitée est comprise entre 0 et 100 et ne contient que des chiffres
              |>  ECOUTE 1 (keydown "enter")
                  - Permet de valider l'entrée utilisateur dans l'input sans que celui-ci lance la recharge 
                    de la page à chaque intéraction (dé/in-crémentation)
                  - Mise à jour quantité au local storage 

              |>  ECOUTE 2 (Change "min/max")
                  - Raffraichit la page lors d'un changement sur la quantité depuis les bouttons min/max des produits
                  - Mise à jour quantité au local storage

          <- SINON Alert Msg Error concernant l'entrée de l'utilisateur pour la quantité du produit ciblé 

  NB: Création d'une regex incluant uniquement des chiffres et un maximum de 3 pour le champs quantité.
*/
//------------------------------------------------------------------------------------------------
//  Regex anti null/lettre/symbole/ et plus de 3 chiffres pour "entrée quantité" du produit
const onlyNumberREGEX = new RegExp("^([0-9]{1,3})$");
//------------------------------------------------------------------------------------------------
async function quantityModifcation(productLocalStorage) {

  const valueQuantityNow = document.querySelectorAll(".itemQuantity");

  for (let index = 0; index < valueQuantityNow.length; index++) {
    // ECOUTE 0
    valueQuantityNow[index].addEventListener('input', (event) => {
      let qttModifValue_new = valueQuantityNow[index].value;
      
        if (qttModifValue_new > 0 && qttModifValue_new <= 100 && (qttModifValue_new.match(onlyNumberREGEX))) {
          // ECOUTE 1
          valueQuantityNow[index].addEventListener('keydown', (event) => {
            const enterTouch = event.key;

            if (enterTouch === 'Enter') {
            // modification de la valeur en temps réel
            console.log(enterTouch);
            productLocalStorage[index].quantity = parseInt(qttModifValue_new);
            localStorage.setItem("produit", JSON.stringify(productLocalStorage));
            
            // actualisation
            location.reload();
            return;
            }
          })

          // ECOUTE 2
          valueQuantityNow[index].addEventListener('change', (event) => {
            productLocalStorage[index].quantity = parseInt(qttModifValue_new);
            localStorage.setItem("produit", JSON.stringify(productLocalStorage));

            //actualisation
            location.reload();
          })
        } 
        
        else {
          alert(`Veuillez respecter les règles suivantes ; 
        * Ne peux pas être vide,
        * Contenir de lettres, 
        * De caractères spéciaux, 
        * Et ne avoir plus de 3 chiffres pour quantité (max 100).`);
          console.log("Je suis supérieur à 100");

          //actualisation (avec reload remet à jour input quantité)
          location.reload();
        }
    }) // fin de l'event change
  } // fin de boucle
};


//------------------------------------------------------------------------------------------------
//  Fonction suppression d'un article dans le panier
//------------------------------------------------------------------------------------------------
/* 
    Info: Permet d'affacer un article de manière définitive du panier de l'utilisateur
      
      - Pointe la classe sur laquelle on récupère l'empalcement du boutton (DOM)
          <=> BOUCLE sur les boutons suppr. des différents produits du panier
              |>  ECOUTE .click pour chaque boutton suppr.

                ->  SI le panier est plus grand ou égal à deux :
                  - Création de deux variables temporaires (depuis les données du panier):
                    * idProduct_now prend pour valeur id du produit 
                    * idColor_Now prend pour valeur la couleur du produit
                      
                      <Mtd> .filter (FILTRE) afin de récupérer la valeur des produits différents
                      de la conditions pour mieux cibler le produit à effacer du panier/locale Storage.
                        - Enregistrement sur le locale storage avec un tableau restructurée (élément ciblé)
                        
                <- SINON effacer le local storage pour un panier totalement vide 

  Explication du filtre + :
    1/ Le filtre vérifie si la couleur et id sont différent du produit(ref click) depuis le filtre.
    --->
      2/ Si vrai, les valeurs trouvées sont à nouveau stockées dans le locale storage 
      qui l'interprête comme nouveau tableau excluant l'élément id/color du présent produit
      ayant servit de "condition de filtre".
      --->
        3/ Stokage du nouveau tableau sans la valeur pointée(ref click).
*/
//------------------------------------------------------------------------------------------------
async function ProductDelete (produitLocalStorage) {
  // console.log(productLocalStorage);
 
  // le query selector all cible tout les éléments qui ont la même classe (contre la première sans "All")
  const deleteButton = document.querySelectorAll(".deleteItem");
  
  for (let index = 0; index < deleteButton.length; index++) {

    // console.log(deleteButton);

    deleteButton[index].addEventListener('click', (event) => {

      if (productLocalStorage.length >= 2 ) {
        console.log("je supprime quelque chose !");
        console.log(productLocalStorage[index]);
        console.log(productLocalStorage[index].id);
        console.log(productLocalStorage[index].color);
      
      let idProducts_now = productLocalStorage[index].id;
      let idColor_now = productLocalStorage[index].color;

      productLocalStorage = productLocalStorage.filter(el => el.id !== idProducts_now || el.color !== idColor_now);

      console.log(productLocalStorage);

      localStorage.setItem("produit", JSON.stringify(productLocalStorage));

      // actualisation (avec reload remet à jour input quantité)
      location.reload();
      }

      else {
        // efface tout et ne laisse pas de tableau vide
        localStorage.clear();

        // actualisation (avec reload remet à jour input quantité)
        location.reload();
      }  
    })
  }
}

//  ************************************************************************************************************************
//                                                        FORMULAIRE 
//  ************************************************************************************************************************
// ----------------------------REGEX
//regex vérifie les caractères spéciaux
let caracSpecREGEX = new RegExp("^([^@&()!_$*€£`+=\/;?#])+$");

// regex verifie prénom lettre min/maj qui accepte {,.'-} et min 1, max 50
let firstNameREGEX = new RegExp("^([a-zA-Zàâäéèêëïîôöùûüç ,.'-]{1,50})$");

// regex verifie nom lettre min/maj qui accepte {,.'-} et min 1, max 55
let lastNameREGEX = new RegExp("^([a-zA-Zàâäéèêëïîôöùûüç ,.'-]{1,55})$"); 

// regex vérifie entrée nombre, espace, entrée de lettre quelconque
let adressREGEX = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]{1,15})(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]{1,75})+$");

// regex vérifie 5 chiffre, espace, entrée de lettre quelconque en acceptant carac.spé accent, limité à 46 lettres
let cityREGEX = new RegExp("^(([0-8][0-9])|(9[0-5])|(2[ab]))+([0-9]{3}){1}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]{1,75})+$");

//--------------------------------------------------------------------------------------------------------/!\
// Pour que la limitation fonctionne dans le regex commun en ligne, enlever le +entre chaque enchaînement
// bloc test... Sinon, la limitation n'est pas pris en compte et cela devient trop permissive. 
// Les + à enlever sont espacésdans la regex ci-dessous ;
//--------------------------------------------------------------------------------------------------------/!\
// let emailREGEX = /^([a-zA-Z0-9_\.\-]) + \@(([a-zA-Z0-9\-]) + \.)+([a-zA-Z0-9]{2,4}) + $/; --------------> EXEMPLE AVEC LES "+", VALIDE EN LIGNE
let emailREGEX = /^([a-zA-Z0-9_\.\-]{1,10})\@(([a-zA-Z0-9\-]{1,10})\.)+([a-zA-Z0-9]{2,10})$/; // -------> Regex corrigé pour limitation
// ----------------------------REGEX

// sélection des inputs dans une variable
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]');

// initialisation des varaibles 
let firstName, lastName, address, city, email;

//------------------------------------------------------------------------------------------------
// Fonction errorDisplay()
//------------------------------------------------------------------------------------------------
/*
  Info: Affiche un message en fonction d'une valeur booléen présent dans les params/arguments de
  la fonction.

  Cette fonction prend trois paramètres : 
    * Tag : Permet d'être remplacé par la variable qui prend en compte un champs d'entrée utilisateur 
            (example: firstName...)
    * Message : Accueil une chaîne de caractère qui une donne une information en lien avec l'entrée utilisateur.
    * Valid : Un booléen qui pemert ici de valider un champs de formulaire.

      - Construction du tag qui prend en compte l'ID d'un élément du DOM pour afficher les messages (balise "p")
        ->  SI valid vaut false, ajout style pour marquer l'erreur.
        <-  SINON, ajout style pour marquer la validation du champs.
*/
//------------------------------------------------------------------------------------------------
const errorDisplay = (tag, message, valid) => {
  
  // const container = document.querySelector("cart__order__form__question");
  const p_elt = document.querySelector("#" + tag);
  // console.log(p_elt);
  
  if (!valid) {
    console.log("CONFLIT REG");
    p_elt.textContent = message;
    p_elt.style.color = '#c90f00';
    p_elt.style.fontWeight = 'bold';
  }
  
  else {
    console.log("c'est bon, regex pas en conflit");
    p_elt.textContent = message; 
    p_elt.style.color = '#75ff33'; 
    p_elt.style.fontWeight = 'bold'; 
  }
}


//------------------------------------------------------------------------------------------------
//  Fonction de vérification entrée utilisateur
//------------------------------------------------------------------------------------------------
/*
    Info: Pour chaque champs, permet de vérifier puis de valider ou non l'entrée utilisateur.

    Fonctionnement général :
      ->  SI l'entrée utilisateur est différente de l'expression régulière associée
          - lance fonction message error(tag,message)
          - Retour valeur variable associée au champs = NULL
      <-  SINON lance fonction message error en validant l'entrée (tag, message, true)
          - Retour valeur variable associée au champs avec la valeur entrée par l'utilisateur
         
*/
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------FirstNameChecker
const firstNameChecker = (value) => {
  console.log(value);
  if (!value.match(firstNameREGEX)) {
    errorDisplay("firstNameErrorMsg", "Prénom entre 1 et 50 caractères, sans chiffres ou de caractères spéciaux.");
    if (!value.match(caracSpecREGEX)) errorDisplay("firstNameErrorMsg", "Pas de caractères spéciaux tel que : $%=@...");
    if (value.length == 0) errorDisplay("firstNameErrorMsg", "");
    
    firstName = null;
  }

  else {
    console.log("regex ok");
    errorDisplay("firstNameErrorMsg","Prénom valide.", true);
    firstName = value;
    console.log(firstName + " " + value);
  }
};

//------------------------------------------------------------------------------------------------LastNameChecker
const lastNameChecker = (value) => {
  console.log(value);
  if (!value.match(lastNameREGEX)) {
    errorDisplay("lastNameErrorMsg", "Nom entre 1 et 55 caractères, sans chiffres ou de caractères spéciaux.");
    if (!value.match(caracSpecREGEX)) errorDisplay("lastNameErrorMsg", "Pas de caractères spéciaux tel que : $%=@...");
    if (value.length == 0) errorDisplay("lastNameErrorMsg", "");
    lastName = null;
  }

  else {
    console.log("regex ok");
    errorDisplay("lastNameErrorMsg","Nom valide.", true);
    
    lastName = value.toUpperCase();
    console.log(lastName + " " + value);
  }
};


//------------------------------------------------------------------------------------------------AdressChecker
const addressChecker = (value) => {
  console.log(value);
  if (!value.match(adressREGEX)) {
    errorDisplay("addressErrorMsg","format adresse : N°(3 max) + rue + nom de la rue.");
    if (!value.match(caracSpecREGEX)) errorDisplay("addressErrorMsg", "Pas de caractères spéciaux tel que : $%=@...");
    if (value.length > 75) errorDisplay("addressErrorMsg", "Adresse limitée à 75 caractères...");
    if (value.length == 0) errorDisplay("addressErrorMsg", "");
    address = null;
  }
  
  else {
    errorDisplay("addressErrorMsg", "Adresse valide.", true);
    address = value;
    console.log(address + " " + value);
  }
};

//------------------------------------------------------------------------------------------------CityChecker
const cityChecker = (value) => {
  console.log(value);
  if (!value.match(cityREGEX)) {
    errorDisplay("cityErrorMsg", "Exemple code postal : 97400 + nom de la ville");
    if (!value.match(caracSpecREGEX)) errorDisplay("cityErrorMsg", "Pas de caractères spéciaux tel que : $%=@...");
    if (value.length > 75) errorDisplay("cityErrorMsg", "Ville limitée à un total de 75 caractères...");
    if (value.length == 0) errorDisplay("cityErrorMsg", "");
    city = null;
  }
  
  else {
    errorDisplay("cityErrorMsg", "Code postal valide.", true);
    city = value;
    console.log(city + " " + value);
  }
};

//------------------------------------------------------------------------------------------------EmailChecker
const emailChecker = (value) => {
  console.log(value);
  if (!value.match(emailREGEX)) {
    email = null;
    errorDisplay("emailErrorMsg", "Email type : dupont85@gmail.com");
    if (value.length == 0) errorDisplay("emailErrorMsg", "");
    // if (!value.match(caracSpecREGEX)) errorDisplay("emailErrorMsg", "Pas de caractères spéciaux tel que : $%=... Le @ et (-_.) sont tolérés ");
}

  else {
    errorDisplay("emailErrorMsg", "Email valide.", true);
    email = value;
    console.log(email + " " + value);
  }
};


//------------------------------------------------------------------------------------------------
//  Fonction getKey()
//------------------------------------------------------------------------------------------------
/*
    Info: Permet de prendre en compte l'entrée utilisateur

      <=> BOUCLE pour chaque entrée utilisateur.
        |> ECOUTE l'entrée utilisateur et renvoie sa valeur.
          ->  SWITCH (multiple SI) pour chaque entrée de champs
            - Attribue la valeur entrée utilisateur dans une fonction dédiée
*/
//------------------------------------------------------------------------------------------------
function getKey() {
  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      switch (e.target.id) {
  
        case "firstName":
          firstNameChecker(e.target.value);
          break;
        
          case "lastName":
          lastNameChecker(e.target.value);
          break;
          
          case "address":
          addressChecker(e.target.value);
          break;
          
          case "city":
          cityChecker(e.target.value);
          break;
  
          case "email":
          emailChecker(e.target.value);
          break;
  
          default:
          nul;
          }   
    });
  })
};
getKey();


//------------------------------------------------------------------------------------------------
//  Fonction postForm()
//------------------------------------------------------------------------------------------------
/*
Info: A l'écoute du boutton "commander", permet d'envoyer un formulaire et la composition du 
    panier au serveur ("ID" produit x "quantité" produit). 

      - Cible l'élément du DOM du bouton
        |> ECOUTE au click sur l'élément ciblé
          <Mtd> preventDefault() qui empêche la recharge automatique de la page
          - Création d'un nouvel tableau pour accueillir le ID des produits présents dans le panier

          -> SI le panier n'est pas vide
            <=> BOUCLE pour chaque produit présent dans le local storage
                - Création de variable qui vont contenir id et quantité des produits du panier
                  <=> BOUCLE sur la quantité des produits
                      - ajoute dans le tableau le nombre x de produit équivalent à leur quantité totale
            
            -> SI les variables du formulaire sont valide (pas Null)
              - Création d'un objet qui récupère leur valeur 
              - Associe le tableau qui contient les produits x leur quantité

              - Création de la method qui va transformer en JSON ce qu'on envoie au server

              - FETCH avec route dédiée
              - Promesse si la réponse existe sinon catch ERROR
              - Création élément DOM de la page confirmation, pointe vers "orderId"
              - Lien vers la page confirmation avec ajout du numéro de commande dans l'url
              - Nettoyage local storage
              - Message de validation

              <=> BOUCLE remise à zéro des variable/entrée 

            <-  SINON affiche un message qui requière le remplissage des champs en rouge

          <-  SINON affiche un message qui requière que le panier ne soit pas vide
*/
//------------------------------------------------------------------------------------------------
function postForm() {
  const form = document.getElementById("order");
  // postForm();
  form.addEventListener("click", (event) => {
    event.preventDefault();
    
    // test value ok pour form -----------
    firstName = "Vincent";  
    lastName =  "Lopez";
    address = "12 rue responsive";
    city = "78200 mantes la jolie";
    email = "vincent@gmail.com";
    // -----------------------------

    console.log("je fonctionne au clic de form !");
    console.log(firstName + " " + lastName + " " + address + " " + city + " " + email);
    
    if (productLocalStorage) {
        // création du tableau de produit à poster
      let productsArrayToPost = [];

      // boucle sur le produits du locale Storage
      for (let i = 0; i < productLocalStorage.length; i++) {
        let idProduct = productLocalStorage[i].id;
        let qttProduct = productLocalStorage[i].quantity;
          for (let q = 0; q < qttProduct; q++) {
            // const element = array[q];
            productsArrayToPost.push(idProduct);

          }
        
      }
      console.log(productsArrayToPost);

      if (firstName && lastName && address && city && email) {
        const order = {
          contact : {
            firstName,
            lastName,
            address,
            city,
            email,
          },
          products: productsArrayToPost 
        };

      const options = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Accept' : 'application/json',
          "Content-Type": "application/json"
        },
      };

      // récupération api et ajout données
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          // localStorage.setItem("orderId", data.orderId);
          const orderId_elt = document.getElementById("orderId");
          document.location.href = `confirmation.html?orderId=${data.orderId}#limitedWidthBlock`;
          // orderId_elt.textContent = cartOrder;
          localStorage.clear(); // vide le local pour de nouvelle commande.
        })
        .catch((error) => {
          alert("erreur du Fetch : " + error);
        });

        // Message commande
        alert(`Commande validée ! 
Vous allez être redirigé vers la page qui affichera votre bon de commande.`);

        // valeur remisent à zéro après post
        inputs.forEach(input => (input.value) = "");
        firstName = null;
        lastName = null;
        address = null;
        city = null ;
        email = null; 
      }

      else {
        alert(`Veuillez remplir les champs ponctués d'un commentaire rouge`);
      }
    }// fin if/local storage
    
    else {
      alert(`Votre panier est vide. Veuillez à choisir au minimum un article et remplir le formulaire avant de valider la commande`);
    }

  }); // fin ecoute
};

postForm();