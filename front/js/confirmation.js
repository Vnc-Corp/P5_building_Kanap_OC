function DisplayOrderId() {
    const orderId_elt = document.getElementById("orderId");
    orderId_elt.textContent = localStorage.getItem("orderId");
    console.log(localStorage.getItem("orderId"));
}

DisplayOrderId();