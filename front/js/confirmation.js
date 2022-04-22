
/* récupération de orderId, transmit via l'url */
//------------------------------------------------------------------------------------------------
let str = window.location.href;
let url = new URL(str);
let cartOrder = url.searchParams.get("orderId"); // va chercher les paramètres de la route back-end js


//------------------------------------------------------------------------------------------------
//  Fonction DisplayOrderId()
/*
    Info:   Affiche le bon de commande.
        
        -   Cible l'élément du DOM qui affichera le numéro de commande
        -   Attribue la valeur qui correspond à OrderId
*/
//------------------------------------------------------------------------------------------------
function displayOrderId() {
    const orderId_elt = document.getElementById("orderId");
    orderId_elt.textContent = cartOrder;
    
    console.log(cartOrder);
}

displayOrderId();

