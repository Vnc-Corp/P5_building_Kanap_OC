// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
//  Importation panier + affichage console
//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let productLocalStorage = JSON.parse(localStorage.getItem("produit"));

//affichage du panier
console.table(productLocalStorage);


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
  
  const productCartInfo = productLocalStorage.map((cartDonnee) => {
    const find_info_ID = productInfo.find((cartInfo) => cartInfo._id === cartDonnee.id);

      // initialiser le .find qui va trouver l'article
      if (find_info_ID) {
        console.log("IF - ID du Produit du local : " + find_info_ID._id);
        console.log("! trouvé ! dans find local storage " + cartDonnee.id);
        
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


