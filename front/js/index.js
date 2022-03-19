// -------------------------------------------------------------------------------------------------------
//  Appel de la fonction générale qui affiche les article Kanap sur la page
//--------------------------------------------------------------------------------------------------------
theSection()

// -------------------------------------------------------------------------------------------------------
// Création de la fontion theSection
//--------------------------------------------------------------------------------------------------------
/*
    -   création de la fonction d'appel "theSection" en asynchrone
    -   attribut données de fonction "getArticle" dans une variable "articles" (data du fletch)
    -   attibut variable "articles" comme argument à fonction "displayArticles"

    Nb : Fait office de lien entre les différentes fonctions
*/
//--------------------------------------------------------------------------------------------------------
async function theSection () {
    const articles = await getArticle();
    displayArticles(articles);
};

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
//  Fonction qui récupère le fletch(article) 
/* 
    -   boucle avec .map les informations contenu dans (article) et deviennent item..
    -   injection au dom de code html avec valeur dédiée (ex: item.name)
*/
//--------------------------------------------------------------------------------------------------------
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