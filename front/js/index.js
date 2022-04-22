// -------------------------------------------------------------------------------------------------------
//  Appel de la fonction générale qui affiche les articles Kanap sur la page
//--------------------------------------------------------------------------------------------------------
displaySection()

// -------------------------------------------------------------------------------------------------------
// Fonction displaySection()
//--------------------------------------------------------------------------------------------------------
/*
    Info : Cheminement d'acquisition et de transmission de "data" de l'"API".
        -   Attribut données de fonction "getArticle()" dans une variable "articles"
        -   Attribut variable "articles" comme argument à fonction "displayArticles()"

    NB : Fait office de lien entre les différentes fonctions
*/
//--------------------------------------------------------------------------------------------------------
async function displaySection () {
    const articles = await getArticle();
    displayArticles(articles);
};


// -------------------------------------------------------------------------------------------------------
//  Fonction récupération données API et retour
// -------------------------------------------------------------------------------------------------------
/*
    Info : Permet d'exploiter les données API en dehors
        -   Va chercher l'accès à l'API
        -   Promesse avec retour en json
        -   Promesse avec transmission donnée à response
        -   Retour si l'API distant n'est pas disponible
*/
//--------------------------------------------------------------------------------------------------------
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


// -------------------------------------------------------------------------------------------------------
//  Fonction displayArticles() 
// -------------------------------------------------------------------------------------------------------
/* 
    Info : Récupère données api, pour les exploiter ici (afficher les produit de l'api)
        <=> boucle avec .map les informations contenu dans (article) et deviennent item
            -   injection au dom de code html avec valeur dédiée (ex: item.name)
                " Lien + article + img/alt + nom + description "
*/
//--------------------------------------------------------------------------------------------------------
function displayArticles(articles) {
    const product_item = articles.map((item) => {

        // Ajout du lien
        let productLink = document.createElement("a");
        document.querySelector(".items").appendChild(productLink);
        productLink.href = `product.html?id=${item._id}`;

        // Création article
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        // Ajout de l'image
        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = item.imageUrl;
        productImg.alt = item.altTxt;

        // ajout du nom du produit
        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");
        productName.textContent = item.name;

        // ajout de la description de l'article
        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productDescription")
        productDescription.textContent = item.description;

        // console.table(item._id);
        // console.table(item.imageUrl);
        // console.table(item.altTxt);
        // console.table(item.name);
        // console.table(item.description);
    })    
};

