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
function displayproductInfo(productInfo, productLocalStorage) {
  console.log(productLocalStorage[0]);
  
  // if (productInfo.id === productLocalStorage) {
    
    // } else {
      
      // }
      
      
      
      const productCart = productInfo.map((productItem) => {
        // console.log(productItem.name);
        // console.log(productItem._id);
        // console.log("id de data api " + productItem._id);
        
        // initialiser le .find qui va trouver l'article
        
        const findBasketID = productLocalStorage.find((basket_e) => basket_e.id === productItem._id);
        // const findProductID = productItem.find((product_e) => product_e.id);
          if (findBasketID) {
            console.log("IF - ID du Produit du local : " + findBasketID.id);
            console.log("! trouvé ! dans find local storage " + productItem._id);

            document.getElementById("cart__items").innerHTML += `
            <article class="cart__item" data-id="${findBasketID.id}" data-color="${productItem.color}">
                  <div class="cart__item__img">
                    <img src="${productItem.imageUrl}" alt="${productItem.altTxt}>
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${productItem.name}</h2>
                      <p>${findBasketID.color}</p>
                      <p>${productItem.price} €</p>
                    </div>

                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${findBasketID.quantity}">
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
            console.log("else - ID du Produit du local : " + findBasketID);
            console.log("else - ID du Produit du prod info : " + productItem._id);
            
          }
      })    
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