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
//  fonction attribution données (après recup fetch)
//------------------------------------------------------------------------------------------------
/* 
    - permet de récupérer les informations de l'API sans compromettre la sécurité.
    - données utilisé pour l'affiche :
      * name
      * description
      * img-alt
      * price
    
    -> insertion d'une condition qui prend en compte si le panier existe (ne vaut pas null ou 0)
      - s'il existe (vrai), activation variable avec paramètres
      - sinon, injection au DOM en ciblant parant "cart__items" d'une information le mentionnant. 
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
//  Fonction d'affichage du panier
//------------------------------------------------------------------------------------------------
/* 
    * Affiche les éléments de chaque produit disponible dans le panier *
      FONCTIONNEMENT ==================================================>
        - initialise la methode .map (boucle) sur les produits disponible dans le localStorage
          (récupéré au début et parse)
          -> lance une autre methode, .find (recherche) sur le les données de l'api
          avec pour condition que les ID de local et api soient vrais
            -> Puis création des balises/class/etc... à afficher au dom
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
    ->  vérifie que les données du locale storage sont disponible
        ->  boucle pour chaque article (forEach/.map) présent dans le tableau
            - incrément la variable qui sotke le total avec la quantité de chaque produit
            - pointe vers l'élément html du DOM qui affichera la valeur totale des quantités
    -> sinon : error locale storage inaccessible
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
//  Fonction calcul des prix pour une somme totale
//------------------------------------------------------------------------------------------------
/*
    ->  vérifie que les données du locale storage sont disponible
        ->  boucle pour chaque article (forEach/.map) présent dans le tableau locale storage
            ->  lancement de la méthode .find pour rechercher les id commun des deux tableau
                afin de pouvoir récupérer les prix de chaque article de manière securisée
                -> si retour est vrai (id coïencident)
                  - incrémente la variable totale des prix avec le calcul suivant (pour chaque article):
                  > multiplie la quantité récupéré du locale storage
                    par le prix associé à l'article récupéré depuis la variable de données API
                    
                  - pointe vers l'élément html du DOM qui affichera la valeur totale des prix
    -> sinon : error locale storage inaccessible
*/
//------------------------------------------------------------------------------------------------
function calculPrice(productLocalStorage, productInfo) {
  // console.log("function calcul prix lancé");
  // console.log(productInfo);

  if (productLocalStorage) {
    // console.log("local storage du if de calcul price lancé");

    productLocalStorage.forEach(cartDataPriceQT => {

      // console.log(cartDataPriceQT);
      const findPrice_ID = productInfo.find((cartPriceInfo) => cartPriceInfo._id === cartDataPriceQT.id);
      if (findPrice_ID) {
        // console.log(findPrice_ID);
        totalPrice += cartDataPriceQT.quantity * findPrice_ID.price; 
        document.getElementById("totalPrice").textContent = totalPrice;
        // console.log(" ...............................");
      }

    }); // fin forEach
  } 
  
  else {
    alert(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`)
    console.log(`ERROR : Impossible d'accéder au tableau des produit en locale storage ${productLocalStorage}`);
  }
};


//------------------------------------------------------------------------------------------------
//  Fonction modification des quantités (localSto) / en différé/recharge auto de la page (DOM)
//------------------------------------------------------------------------------------------------
/* 
    ->  Pointe la classe sur laquelle on récupère l'information quantité value du DOM
        ->  Boucle sur la valeur/quantité des différents produits du panier
            ->  Ecoute d'un event sur le moindre changement sur la valeur pointé (.change)
                - création d'une variable temp. pour valeur de chaque produit
                  ->  Ajout d'une condition anti lettre et quantité compris entre 0 et 100
                      - attribution de la nouvelle valeur/quantité à la valeur/quantité du local Storage (ciblant quantity du produit)
                      - mis à jour du local storage
                  -> Sinon, erreur concernant l'entrée de l'utilisateur pour la quantité du produit ciblé 
*/
//------------------------------------------------------------------------------------------------
async function quantityModifcation(productLocalStorage) {
  
  // cible la valeur du dom
  const valueQuantityNow = document.querySelectorAll(".itemQuantity"); // affiche

  // boucle sur tout les produits du panier existant
  for (let index = 0; index < valueQuantityNow.length; index++) {

    // ecoute sur le dom
    valueQuantityNow[index].addEventListener('change', (event) => {
      console.log("je suis le click de add ev");

      //variable temp
      let qttModifValue_new = valueQuantityNow[index].value;
      // let qttModifValue_new = parseInt.apply(qttModifValue_new0);
      console.log(typeof qttModifValue_new);
      
        // condition anti > 100
        if (qttModifValue_new > 0 && qttModifValue_new <= 100) {

          // modification de la valeur en temps réel
          productLocalStorage[index].quantity = parseInt(qttModifValue_new);
          localStorage.setItem("produit", JSON.stringify(productLocalStorage));
          
          //actualisation
          location.reload();
        } 
        
        else {
          console.log(typeof qttModifValue_new);
          alert(`Entrée invalide ! Veuillez saisir une quantité compris entre 1 et 100 pour votre produit...`)
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
    (Info) suit le model de base de function modification quantité en temps réel  
    ->  Pointe la classe sur laquelle on récupère l'empalcement du boutton (DOM)
        ->  Boucle sur les boutons suppr des différents produits du panier
            ->  Ecoute d'un event au clic (.click) pour chaque boutton
              ->  Condition si le panier est plus grand ou égal à deux :
                - Création de deux variables temporaires (depuis les données du panier):
                  * idProduct_now prend pour valeur id du produit 
                  * idColor_Nox prend pour valeur la couleur du produit
                  @ Lancement de la méthode .filter afin de récupérer la valeur des produits différents
                  des conditions pour mieux cibler le produit à effacer du panier (locale Storage)
                - Enregistrement sur le locale storage avec un tableau restructurée (élément ciblé)
              -> Sinon effacer le local storage pour un panier vide 
    Explication du filtre + :
    1/ Le filtre vérifie si la couleur et id sont différent du produit de (ref click) depuis le filtre.
    --->
    2/ Si vrai, les valeurs trouvées sont à nouveau stockées dans le locale storage 
    qui l'interprête comme nouveau tableau, qui lui exlut l'élément id/color du présent produit
    qui a servit de condition de filtre.
    --->
    3/ Stokage du nouveau tableau sans la valeur pointée.
*/
//------------------------------------------------------------------------------------------------
async function ProductDelete (produitLocalStorage) {
  console.log(productLocalStorage);
 
  // le query selector all cible tout les éléments qui ont la même classe (contre la première sans "All")
  const deleteButton = document.querySelectorAll(".deleteItem");
  
  for (let index = 0; index < deleteButton.length; index++) {

    console.log(deleteButton);

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

// regex vérifie un nombre quelconque d'entrée de lettre et de chiffre, le @ (x1), nbr et lettre quelconque, le (.) x1) 
// et l'entrée de lettres minuscules compris entre 2 et 10  
let emailREGEX = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1,5}[a-z]{2,10}$");
// ----------------------------REGEX

// sélection des inputs dans une variable
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]');

// initialisation des varaibles 
let firstName, lastName, address, city, email;

//-----------------------------------------------
// fonction affiche message erreur
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

//-----------------------------------------------
// fonction ciblage des regex / affichage acction
//-----------------------------------------------
//---------------------------------------------------------------------------firstNameChecker
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

//---------------------------------------------------------------------------lastNameChecker
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
//---------------------------------------------------------------------------adressChecker
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

//---------------------------------------------------------------------------cityChecker
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

//---------------------------------------------------------------------------emailChecker
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

//-----------------------------------------------
// (3) afficher / prendre en compte la valeur des entrées de l'utilisateur
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
});

// console.log(form);
// fonction confirmation commande (post)
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
    
    if (firstName && lastName && address && city && email) {
      const orderId = {
        contact : {
          firstName,
          lastName,
          address,
          city,
          email,
        },
        products : productLocalStorage,
      };

      const promise01 = fetch("http://localhost:3000/api/order", {
        method: "POST",
        body: JSON.stringify(orderId),
        headers: {
          "Content-Type": "application/JSON",
        }
      });

      promise01.then(async (response) => {
        try {
          console.log(response);
          const contenu = await response.JSON();
          console.log(contenu);
        }
        catch (error) {
          console.log(error);
        }
      });

      alert("Commande validée !");
      console.log(orderId);

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
  });
};

postForm();