//const { paidInFull, emptyCart } = require("./script");

let currencySymbol = '$';
let currency = 'USD';

// Draws product list
function drawProducts() {
    let productList = document.querySelector('.products');
    let productItems = '';
    products.forEach((element) => {
        productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${ currencyExchange(currency, element.price)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
    // use innerHTML so that products only drawn once
    productList.innerHTML = productItems;
}

// Draws cart
function drawCart() {
    let cartList = document.querySelector('.cart');
    // clear cart before drawing
    let cartItems = '';
    cart.forEach((element) => {
        let itemTotal = element.price * element.quantity;

        cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${ currencyExchange(currency, element.price) }</p>
                <p>quantity: ${element.quantity}</p>
                <p>total: ${currencySymbol}${ currencyExchange(currency, itemTotal) }</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">remove</button>
            </div>
        `;
    });
    // use innerHTML so that cart products only drawn once
    // cart.length
    //     ? (cartList.innerHTML = cartItems)
    //     : (cartList.innerHTML = 'Your Cart is Empty');
    // only show the empty cart button if there are items in the cart
    let shoppingCart = document.querySelector('.empty-btn'); 
    if (cart.length) {
        cartList.innerHTML = cartItems;
        shoppingCart.classList.remove("hidden");
    }
    else {
        shoppingCart.classList.add("hidden");
        cartList.innerHTML = 'Your Cart is Empty';
    }
}

// Draws checkout
function drawCheckout() {
    let checkout = document.querySelector('.cart-total');
    let paymentButton = document.querySelector('.pay');
    checkout.innerHTML = '';

    // run cartTotal() from script.js
    let cartSum = cartTotal();

    let div = document.createElement('div');
    div.innerHTML = `<p>Cart Total: ${currencySymbol}${ currencyExchange(currency, cartSum) }`;
    checkout.append(div);
    if (cartSum === 0) {
        paymentButton.disabled = true;
    } else {
        paymentButton.disabled = false;
    }
}
// clears the receipt
function emptyReceipt() {
    let paymentSummary = document.querySelector('.pay-summary');
    paymentSummary.innerHTML = '';
}

// Initialize store with products, cart, and checkout
drawProducts();
drawCart();
drawCheckout();

document.querySelector('.products').addEventListener('click', (e) => {
    let productId = e.target.parentNode.getAttribute('data-productId');
    productId *= 1;
    addProductToCart(productId);
    drawCart();
    drawCheckout();
});

// Event delegation used to support dynamically added cart items
document.querySelector('.cart').addEventListener('click', (e) => {
    // Helper nested higher order function to use below
    // Must be nested to have access to the event target
    // Takes in a cart function as an argument
    function runCartFunction(fn) {
        let productId = e.target.parentNode.getAttribute('data-productId');
        productId *= 1;
        for (let i = cart.length - 1; i > -1; i--) {
            if (cart[i].productId === productId) {
                let productId = cart[i].productId;
                fn(productId);
            }
        }
        // force cart and checkout redraw after cart function completes
        drawCart();
        drawCheckout();
    }

    // check the target's class and run function based on class
    if (e.target.classList.contains('remove')) {
        // run removeProductFromCart() from script.js
        runCartFunction(removeProductFromCart);
    } else if (e.target.classList.contains('qup')) {
        // run increaseQuantity() from script.js
        runCartFunction(increaseQuantity);
    } else if (e.target.classList.contains('qdown')) {
        // run decreaseQuantity() from script.js
        runCartFunction(decreaseQuantity);
    }
});

document.querySelector('.pay').addEventListener('click', (e) => {
    e.preventDefault();

    // Get input cash received field value, set to number
    let amount = document.querySelector('.received').value;
    amount *= 1;

    // Set cashReturn to return value of pay()
    let cashReturn = pay(amount, currency);

    let paymentSummary = document.querySelector('.pay-summary');
    let div = document.createElement('div');
    let paymentButton = document.querySelector('.pay');

    // If total cash received is greater than cart total thank customer
    // Else request additional funds
    if (cashReturn >= 0) {
        document.querySelector('.received').value = '';
        div.innerHTML = `
            <p>Cash Received: <span class="bold">${currencySymbol}${ amount.toFixed(2) }</span></p>
            <p>Cash Returned: <span class="success bold">${currencySymbol}${cashReturn.toFixed(2) }</span></p>
            <p class="success bold">Thank you!</p>
        `;
        // disable the payment button if they paid in full and reset the cart.
        paymentButton.disabled = true;
        // wait 3 seconds and reset everything
        setTimeout(() => {
            paidInFull();
            emptyCart();
            drawCart();
            drawCheckout();
            emptyReceipt();
        }, "3000");
    } else {
        // reset cash field for next entry
        document.querySelector('.received').value = '';
        div.innerHTML = `
            <p>Cash Received: <span class="bold">${currencySymbol}${ amount.toFixed(2) }</span></p>
            <p>Remaining Balance: <span class="error bold">${currencySymbol}${ Math.abs(cashReturn).toFixed(2) }</span></p>
            <p class="error bold">Please pay additional amount.</p>
            <hr/>
        `;
        // enable the payment button if they added more to the cart or if there is a balance
        paymentButton.disabled = false;
    }

    paymentSummary.append(div);
});

/* Standout suggestions */
/* Begin remove all items from cart */
function dropCart(){
    let shoppingCart = document.querySelector('.empty-btn');
    let div = document.createElement("button");
    div.classList.add("empty");    
    div.innerHTML = `Empty Cart`;
    shoppingCart.append(div);
}
dropCart();

document.querySelector('.empty-btn').addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')){
        emptyCart();
        drawCart();
        drawCheckout();
    }
})
/* End all items from cart */

/* Begin currency converter */
function currencyBuilder(){
    let currencyPicker = document.querySelector('.currency-selector');
    let div = document.createElement("label");
    div.classList.add("currencyLabel");
    div.innerHTML = `Please select your currency: `;
    currencyPicker.append(div);
    let select = document.createElement("select");
    select.classList.add("currency-select");
    select.innerHTML = `<option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="YEN">YEN</option>`;
    currencyPicker.append(select);
}
currencyBuilder();

document.querySelector('.currency-select').addEventListener('change', function handleChange(event) {
    switch(event.target.value){
        case 'EUR':
            currencySymbol = '€';
            currency = 'EUR';
            break;
        case 'YEN':
            currencySymbol = '¥';
            currency = 'YEN';
            break;
        default:
            currencySymbol = '$';
            currency = 'USD';
            break;
     }

    drawProducts();
    drawCart();
    drawCheckout();
});
/* End currency converter */
/* End standout suggestions */
