let totalPaid = 0;
let errorMsg = '';

/* Create an array named products which you will use to add all of your product object literals that you create in the next step. */
/* Create 3 or more product objects using object literal notation 
   Each product should include five properties
   - name: name of product (string)
   - price: price of product (number)
   - quantity: quantity in cart should start at zero (number)
   - productId: unique id for the product (number)
   - image: picture of product (url string)
*/
const products = [
  { name: "Cherries", price: 8, quantity: 0, productId: 1, image: "/images/cherry.jpg" },
  { name: "Oranges", price: 10, quantity: 0, productId: 2, image: "/images/orange.jpg" },
  { name: "Strawberries", price: 5, quantity: 0, productId: 3, image: "/images/strawberry.jpg" },
  { name: "Bananas", price: 4, quantity: 0, productId: 4, image: "/images/banana.jpg" },
  { name: "Pineapples", price: 15, quantity: 0, productId: 5, image: "/images/pineapple.jpg" },
  { name: "Blackberries", price: 6, quantity: 0, productId: 6, image: "/images/blackberry.jpg" },
  ];

/* Images provided in /images folder. All images from Unsplash.com
   - cherry.jpg by Mae Mu
   - orange.jpg by Mae Mu
   - strawberry.jpg by Allec Gomes
   - pineapple.jpg by Fernando Andrade
   - banana.jpg by Tim Foster
   - blackberry.jpg by Andres Hernandez

*/

/* Declare an empty array named cart to hold the items in the cart */
const cart = [];

/* Create a function named addProductToCart that takes in the product productId as an argument
  - addProductToCart should get the correct product based on the productId
  - addProductToCart should then increase the product's quantity
  - if the product is not already in the cart, add it to the cart
*/

function addProductToCart(productId) {
  // check if product exists, else ?? not found?
  const foundProduct = products.find(product => product.productId === productId);
  if (foundProduct) {
    // check if the product is actually in the cart 
    const isProductInCart = cart.find(cart => cart.productId === productId)
    if (isProductInCart) {
      // product is in the cart, just increase the quantity
      increaseQuantity(productId);
    } else {
      // product is not in the cart, add it, it adds it at 0 so increase the quantity
      cart.push(foundProduct);
      increaseQuantity(productId);
    }
  } else {
    // To Do: implement error messages in the front end
    errorMsg = `Product with ID ${productId} not found.`;
  }
};

/* Create a function named increaseQuantity that takes in the productId as an argument
  - increaseQuantity should get the correct product based on the productId
  - increaseQuantity should then increase the product's quantity
*/
function increaseQuantity(productId) {
  cart.forEach(cart => {
    if (cart.productId === productId) {
      cart.quantity++; // Increase quantity by 1
    }
  });
}

/* Create a function named decreaseQuantity that takes in the productId as an argument
  - decreaseQuantity should get the correct product based on the productId
  - decreaseQuantity should decrease the quantity of the product
  - if the function decreases the quantity to 0, the product is removed from the cart
*/
function decreaseQuantity(productId) {
  cart.forEach(cart => {
    if (cart.productId === productId) {
      cart.quantity > 1 ? cart.quantity-- : removeProductFromCart(productId); // Decrease quantity by 1 or remove from cart 
    }
  });
}

/* Create a function named removeProductFromCart that takes in the productId as an argument
  - removeProductFromCart should get the correct product based on the productId
  - removeProductFromCart should update the product quantity to 0
  - removeProductFromCart should remove the product from the cart
*/

function removeProductFromCart(productId) {
  const indexToRemove = cart.findIndex(cart => cart.productId === productId);
  cart[indexToRemove].quantity = 0; // change the quantity back to zero
  if (indexToRemove !== -1) {
    cart.splice(indexToRemove, 1); // Remove the product at the found index
  }
}

/* Create a function named cartTotal that has no parameters
  - cartTotal should iterate through the cart to get the total cost of all products
  - cartTotal should return the total cost of the products in the cart
  Hint: price and quantity can be used to determine total cost
*/

function cartTotal() {
  let cartTotal = 0;
  for (const item of cart) {
    const itemSubtotal = item.price * item.quantity; // Calculate subtotal for current item
    cartTotal += itemSubtotal; // Add subtotal to the running total
  }
  return cartTotal; // Return the final total
}

/* Create a function called emptyCart that empties the products from the cart */
function emptyCart() {
  cart.splice(0, cart.length);
};

/* Create a function named pay that takes in an amount as an argument
  - amount is the money paid by customer
  - pay will return a negative number if there is a remaining balance
  - pay will return a positive number if money should be returned to customer
  Hint: cartTotal function gives us cost of all the products in the cart  
*/
function pay(amount, currency) {
  totalPaid += amount;
  const balance = currencyExchange(currency, cartTotal());
  const change = totalPaid - balance;
  return change;
}

/* Place stand out suggestions here (stand out suggestions can be found at the bottom of the project rubric.)*/

function currencyExchange(currency, amount){
  if (currency === "EUR") {
    priceCurrency = (amount * 0.86).toFixed(2);
  }
  else if (currency === "YEN") {
    priceCurrency = (amount * 147.21).toFixed(2);
  }
  else {
    priceCurrency = (amount).toFixed(2);
  }
  return priceCurrency;
}

/* The following is for running unit tests. 
   To fully complete this project, it is expected that all tests pass.
   Run the following command in terminal to run tests
   npm run test
*/

module.exports = {
  products,
  cart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  removeProductFromCart,
  cartTotal,
  pay, 
  emptyCart,
  currencyExchange,
  totalPaid
}
