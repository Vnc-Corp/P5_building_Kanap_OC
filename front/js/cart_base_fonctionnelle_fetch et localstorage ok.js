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
  console.log("displayArticle");
  const productCart = productInfo.map((item) => {
        console.log("id de data api " + item._id);
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
      })    
};