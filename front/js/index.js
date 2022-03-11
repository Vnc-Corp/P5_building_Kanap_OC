// //
// fetch("http://localhost:3000/api/products")
//     .then( res => res.json()) 
//     .then( data => console.log(data); {
//         // for(let jsonArticle of jsonListArticle) {
//         //     let article = new Article(jsonArticle);
//         //     document.querySelector(".item").innerHTML += 
//         //     `
//         //     <section class="items" id="items">
//         //         <a href="./product.html?id=42">
//         //             <article>
//         //                 <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//         //                 <h3 class="productName"${article.name}</h3>
//         //                 <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//         //             </article>
//         //         </a>
//         //     </section>
//         //     `
//         // }


//     console.log(jsonListArticle);
// });

// const img = document.getElementById('img');

// fetch("http://localhost:3000/api/products")
//     .then( res => res.json()) 
//     .then( data => img.src = data[0].imageUrl)

// ---------------------------------------------
// Lecture
// let articleLinea = localStorage.getItem("obj");
// let arrayBasket = JSON.parse(articleLinea);

// async function visuelArticleBasket(articleStokage) {
//     for (let i = 0; i < arrayBasket.length; i++) {
//         const element = arrayBasket[i];
//     }
//     console.log(arrayBasket);
// };

// visuelArticleBasket();
// console.log(articleJson.quantity + articleJson.color + articleJson.id);
// console.log(arrayBasket);
//----------------------------------------------------------------------------------------------------------
//appel de la fonction générale qui affiche les article Kanap
theSection()

// création de la fonction d'appel "theSection";
// Attribut données de fonction "getArticle" dans une variable "articles"
// attibut variable "articles" comme argument à fonction "displayArticles" 
async function theSection () {
    const articles = await getArticle();
    displayArticles(articles);
};

// Fonction asynchrone pour récupérer données API et faire un retour
// afin d'exploiter le tableau à l'extérieur (cible, fonction "displayArticles)
async function getArticle() {
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

// Fonction qui récupère le fletch et inject au DOM les variables requisent et les affichent
// via un innerHTLM qui cible la section dont l'ID est 

function displayArticles(articles) {
    console.log("displayArticle");
        const product_item = articles.map((item) => {
            document.getElementById("items").innerHTML += `
            <a href="product.html?id=${item._id}">
                <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}">
                    <h3 id="producName" class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article>
            </a>
            `
            console.table(item._id);
            console.table(item.imageUrl);
            console.table(item.altTxt);
            console.table(item.name);
            console.table(item.description);
        });
     
}
// Affichetab_test();
document.addEventListener('DOMContentLoaded', function() {
    
    console.table(arrayBasket);
});

//---------------------------------------function ok--------------------------------------------------------
// async function theSection () {
//     const articles = await getArticle();
//     // console.log(articles);
//     displayArticles(articles)
// };

// function getArticle() {
//     return fetch("http://localhost:3000/api/products") 
//         .then(function(httpBodyResponse){
//             return httpBodyResponse.json()
//         })
//         .then(function (dataArticles){
//             // console.table(dataArticles);
//             // returne les données pour devenir exploitable en dehors
//             return dataArticles;
//         })
//         .catch(function(error) {
//             alerte(error)
//     })
// };

// function displayArticles(articles) {
//     console.log("displayArticle");

//         // recup emplacement section pour intégrer les elt tierces tel que name/id/img...
//         const items_elt = document.querySelectorAll('#items');
//         console.table(articles);

//         //créé un element h3
//         let productName_elt = document.createElement("h3");
//         // document.items_elt.appendChild(h3);
//         console.log(items_elt);
        
//         // ajout class
//         productName_elt.classList.add("productName");
//         // console.log(productName_elt);

//         // ajout valeur et retour attendu
//         let productName_value = articles.map(_id => {
//             return ` ${_id.name} `;
//         }).join("");

//         // console.table(productName_value);

//         // ajout valeur à element h3 ! ! ! !  + insertion dans section ! ! ! 
//         productName_elt.textContent = productName_value;
//         // pointage -----------------------------------
//         document
//             .querySelector('#items')
//             .insertAdjacentElement('afterbegin', productName_elt);
//         // -------------------------------------------
//         console.log(items_elt);
//         console.log(productName_elt);

// }

// theSection()





    // productName_elt.innerHTML += productName_value;
    // console.log(productName_value);
    // productName_elt.innerHTML = productName_value;
    // console.log(productName_value);

    //      //création élément productName    
    // let productName_elt = document.createElement("h3");
    // productName_elt.innerHTML += productName_value;
    // productName_elt.classList.add("productName");
    // console.log(productName_elt);

    // for (let truc in articles) {
    // // Insertion de l'élément "article"
    // let productArticle = document.createElement("article");
    // productLink.appendChild(productArticle);




    // Récup élément section items
    
    
    // //création élément productName    
    // let productName_elt = document.createElement("h3");
    // productName_elt.classList.add("productName");
    // productName_elt.innerHTML += '545';
    // console.log(productName_elt);





    // // recup h3
    // let productName_elt = document.querySelector('h3.productName');
    // let productName_value = articles[0].name;
    // productName_elt.innerHTML = productName_value;

//*******************************************************************************

    // // Récup élément section items
    // let items_elt = document.querySelector(".h3");

    // //création élément productName    
    // let productName_elt = document.createElement("div");
    // productName_elt.classList.add("blablabla");
    // productName_elt.innerHTML += 'Salut Vincent !';

    // // ajout productName à items
    // items_elt.appendChild(productName_elt);

    // for (let article in dataArticles) {
    // // Insertion de l'élément "article"
    // let productArticle = document.createElement("article");
    // productLink.appendChild(productArticle);

    // let productName = document.createElement("h3");
    // productArticle.appendChild(productName);
    // productName.classList.add("productName");
    // productName.innerHTML = dataArticles[article].name;
    // }                                                              
//}



//---------------------------------------------------------------------------------------------------
// appel...

// let idItem ="";
// let nameItem ="";



// fetch("http://localhost:3000/api/products")
//   .then(function(res) {
//     if (res.ok) {
//       return res.json();
//     }
//   })
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function(err) {
//     alert(error);
//   });

// for(item of data){
//     document.querySelector('div + section').innerHTML = ` 
//         <div class="column">
//         <h3>Nom : ${nameItem = data.name} </h3> 
//         <h4>Langage préféré : ${idItem} </h4>
//         </div>
//         `;
// }

//-----------------------------------------------------------------------------------------------------------

// // Récupération des articles de l'API
// async function getArticles() {
// var articlesCatch = await fetch("http://localhost:3000/api/products")
// return await articlesCatch.json();
// }

// // Répartition des données de l'API dans le DOM
// async function fillSection() {
// let result = await getArticles ()
// .then(function (dataAPI){
// const articles = dataAPI;
// console.table(articles);
// for (let article in articles) {

// // Insertion de l'élément "a"
// let productLink = document.createElement("a");
// document.querySelector(".items").appendChild(productLink);
// productLink.href = `product.html?id=${dataAPI[article]._id}`;

// // Insertion de l'élément "article"
// let productArticle = document.createElement("article");
// productLink.appendChild(productArticle);

// // Insertion de l'image
// let productImg = document.createElement("img");
// productArticle.appendChild(productImg);
// productImg.src = dataAPI[article].imageUrl;
// productImg.alt = dataAPI[article].altTxt;

// // Insertion du titre "h3"
// let productName = document.createElement("h3");
// productArticle.appendChild(productName);
// productName.classList.add("productName");
// productName.innerHTML = dataAPI[article].name;

// // Insertion de la description "p"
// let productDescription = document.createElement("p");
// productArticle.appendChild(productDescription);
// productDescription.classList.add("productName");
// productDescription.innerHTML = dataAPI[article].description;
// }
// })

// .catch (function(error){
//     return error;
// });
// }
// fillSection();
// ---------------------------------------------------------------
// import Config from './model/Config.js';
// import Product from './model/Product.js';

// // fetch("http://localhost:3000/api/products")
// //   .then(function(res) {
// //     if (res.ok) {
// //       return res.json();
// //     }
// //   })
// //   .then(function(data) {
// //     console.log(data);
// //   })
// //   .catch(function(err) {
// //     alert(error);
// //   });

// /* Affiche les produits sur la page d'accueil */

// async function loadProduct() {
// let config = await Config.getConfig();
// let result = await fetch("http://localhost:3000/api/products");
// let listProduct = await result.json();
// let listItem = document.querySelector("#items");
// for (let product of listProduct) {product = new Product(product);
// listItem.insertAdjacentHTML("beforeend", product.toHtml());
// }
// }
// loadProduct();