// importation panier + affichage via table
//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let productLocalStorage = JSON.parse(localStorage.getItem("produit"));
//affichage du panier
console.table(productLocalStorage);
//------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------
showCartHTML()

// fonction attribution données à fonction d'affichage panier
async function showCartHTML () {
  const productInfo = await getProduct_info();
  displayproductInfo(productInfo, productLocalStorage);
};

//------------------------------------------------------------------------------------------------
// fetch recup API
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
// fonction d'affichage panier
async function displayproductInfo(productInfo, productLocalStorage) {
  console.log(productLocalStorage[0]);
  
  // if (productInfo.id === productLocalStorage) {
    
    // } else {
      
      // }
      
      
      // const producCartLocale = productLocalStorage.map((productLocalStorage) => {
      
      const productCartInfo = productLocalStorage.map((cartDonnee) => {
      const find_info_ID = productInfo.find((cartInfo) => cartInfo._id === cartDonnee.id);

        // console.log(cartDonnee.name);
        // console.log(cartDonnee._id);
        
        // initialiser le .find qui va trouver l'article
        
        // const findProductID = cartDonnee.find((product_e) => product_e.id);
        if (find_info_ID) {
          console.log("IF - ID du Produit du local : " + find_info_ID._id);
          console.log("! trouvé ! dans find local storage " + cartDonnee.id);
          
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
            `

            console.log(" ...............................");
          } else {
            console.log("pas trouvé dans find local storage");
            console.log("else - ID du Produit du local : " + find_info_ID);
            console.log("else - ID du Produit du prod info : " + cartDonnee._id);
            
          }
        })    
      // })
      };
      
      
      // console.log(" Et ID du panier : " + findProductID.id);
      

        // document.getElementById("items").innerHTML +=
        //  `
        // <a href="product.html?id=${item._id}">
        //     <article>
        //         <img src="${item.imageUrl}" alt="${item.altTxt}">
        //         <h3 id="producName" class="productName">${item.name}</h3>
        //         <p class="productDescription">${item.description}</p>
        //     </article>
        // </a>
        // `
        // console.log(item._id);
        // console.log(item.imageUrl);
        // console.log(item.altTxt);
        // console.log(item.name);
        // console.log(item.description);