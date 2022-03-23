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

    console.log("Panier existe");
  }  else {
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
//  Fonction modification des quantités en temps réel (localStorage) / en différé/rechargement de la page (DOM)
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

  






  
  





  // marche que sur le premier
  // valueQuantityNow.addEventListener('click', (event) => {
  //   console.log("je suis le click de add ev");
  // })
  
  // console.log(valueQuantityNow.value);
  
  // const qttLocal = productLocalStorage.map((qttData) => {
  //   console.log(qttData.quantity);
  
    // valueQuantityNow.value += qttData.quantity;
  
    // const find_info_ID = qttData.find((valueQtt_elt) => valueQtt_elt !== qttData);
  
    // valueQuantityNow.addEventListener('click', (event) => {
    //   console.log("je suis le click de add ev");
    // })
  
  
  // }) // fin .map  
     










// async function quantityModifcation() {
  
//   let valueQuantityNow = document.querySelector(".itemQuantity");
//   // console.log(valueQuantityNow.value);
  
//   productLocalStorage.forEach(el => {
//     // valueQuantityNow = el.quantity;
//     // console.log(valueQuantityNow);
//     console.log(el.quantity);

//       // n'écoute que le premier et le multiplie /4 au lieu de lire la boucle en entière
//       valueQuantityNow.addEventListener('change', (event) => {
//       // event.preventDefault();
//         console.log("aie");
//       })
//   });

  
// }




// base
// function quantityModifcation() {

//   const valueQuantityNow = document.querySelectorAll('.itemQuantity');

//   valueQuantityNow.addEventListener('change', (event) => {

    
//   })
  
// };







// async function totalTTC(productCartInfo, productLocalStorage) {
//   console.log(productCartInfo);
//   console.log(productLocalStorage);
  
  
//   const productCartInfo2 = productLocalStorage.map((cartDonnee2) => {
//     const find_info_ID2 = productInfo.find((cartInfo2) => cartInfo2._id === cartDonnee2.id);
    
//     if (find_info_ID2) {
      
//         // console.log(productCartInfo.price);
//         // console.log(productLocalStorage.price);
        
//       } else {
//       console.log("rien");
      
//     }

//   })

// }