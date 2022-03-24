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
*/
//------------------------------------------------------------------------------------------------
async function displayproductInfo(productInfo, productLocalStorage) {
  
  const productCartLocal = productLocalStorage.map((cartDonnee) => {
    const find_info_ID = productInfo.find((cartInfo) => cartInfo._id === cartDonnee.id);

      // initialiser le .find qui va trouver l'article
      if (find_info_ID) {
        // console.log("IF - ID du Produit du local : " + find_info_ID._id);
        // console.log("! trouvé ! dans find local storage " + cartDonnee.id);
        
        // injection au DOM
        document.getElementById("cart__items").innerHTML += `
          <article class="cart__item" data-id="${cartDonnee.id}" data-color="${cartDonnee.color}">
          <div class="cart__item__img">
          <img src="${find_info_ID.imageUrl}" alt="${find_info_ID.altTxt}>
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${find_info_ID.name}</h2>
              <p>${cartDonnee.color}</p>
              <p>${find_info_ID.price} €</p>
            </div>
            
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartDonnee.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
      ` // fin innerHTML

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
                - Création de deux variables temporaires (depuis les données du panier):
                  * idProduct_now prend pour valeur id du produit 
                  * idColor_Nox prend pour valeur la couleur du produit
                @ Lancement de la méthode .filter afin de récupérer la valeur des produits différents
                des conditions pour mieux cibler le produit à effacer du panier (locale Storage)
                - Enregistrement sur le locale storage avec un tableau restructurée (élément ciblé)
                
    Explication du filtre + :
    1/ Le filtre vérifie si la couleur et id sont différent du depuis le filtre.
    --->
    2/ Si vrai, les valeurs trouvé sont à nouveau stocké dans le locale storage 
    qui l'interprête comme nouveau tableau qui lui exlut l'élément id/ color
    qui a servis de condition de filtre.
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
      })
  }
}

