// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
/* récupération de id du produit, suite au clicButton de la page index d'un produit */
//------------------------------------------------------------------------------------------------
// let str = window.location.href;
// let url = new URL(str);
// let productId = url.searchParams.get("id"); // va chercher les paramètres de la route back-end js
// console.log("j'affiche productId : " + productId);

//------------------------------------------------------------------------------------------------
// variable lecture du stringify articleJson/articleSolo/produit
let productLocalStorage = JSON.parse(localStorage.getItem("produit"));

// variable data api ; contient données générales de l'api pour récupérer ce que je n'ai pas envoyé au localStorage (ref prix/nom/img-alt/des)
const articleDataAPI = getFletchAPI(); 
//------------------------------------------------------------------------------------------------
//test log
console.table(productLocalStorage);
console.log(productLocalStorage);

//------------------------------------------------------------------------------------------------
//  appel de fonctions 
getFletchAPI();
// displayCart();


// *****************************************************************************************************************
// *****************************************************************************************************************
//------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
//  Fonction asynchrone pour récupérer données API et faire un retour
/*
    -   va chercher l'accès à l'API
    -   promesse avec retour en json
    -   promesse avec transmission donnée à response
    -   retour si l'API distant n'est pas disponible
    
    Nb : exploite le tableau à l'extérieur en devenant une valeur externe dans la variable articles
    */
   //--------------------------------------------------------------------------------------------------------
  //  console.log(".............data api " + articleDataAPI._id);
  async function getFletchAPI() {
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
  console.log(articleDataAPI.name);
  console.log(".............data api " + articleDataAPI);
//------------------------------------------------------------------------------------------------
// function d'affichage du panier
//------------------------------------------------------------------------------------------------
// async function displayCart() {
//     console.log("...");
//     console.log("article data api " + articleDataAPI);
//         const product_cart = productLocalStorage.map((product) => {

//             // console.log("id des produit " + product.id);
//             // console.log("id des produit " + product.color);
//             // console.log("id des produit " + product.quantity);
//             document.getElementById("cart__items").innerHTML += `

//             <!--  <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
//             <div class="cart__item__img">
//               <img src="${product.imageUrl}" alt="${product.altTxt}>
//             </div>
//             <div class="cart__item__content">
//               <div class="cart__item__content__description">
//                 <h2>Nom du produit</h2>
//                 <p>Vert</p>
//                 <p>42,00 ${product.id}</p>
//               </div>
//               <div class="cart__item__content__settings">
//                 <div class="cart__item__content__settings__quantity">
//                   <p>Qté : </p>
//                   <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
//                 </div>
//                 <div class="cart__item__content__settings__delete">
//                   <p class="deleteItem">Supprimer</p>
//                 </div>
//               </div>
//             </div>
//           </article> --> 
//           `
//         });    
// }

// document.getElementById("items").innerHTML += `
//             <a href="product.html?id=${item._id}">
//                 <article>
//                     <img src="${item.imageUrl}" alt="${item.altTxt}">
//                     <h3 id="producName" class="productName">${item.name}</h3>
//                     <p class="productDescription">${item.description}</p>
//                 </article>
//             </a>
//             `
//             console.table(item._id);
//             console.table(item.imageUrl);
//             console.table(item.altTxt);
//             console.table(item.name);
//             console.table(item.description);