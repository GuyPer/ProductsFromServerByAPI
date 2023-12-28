Using Data from a Server with CRUD and REST API and work with LocalStorage: This project fetches product data from a server using async functions and await. The data is parsed into objects using `json()`, and it's displayed on the DOM.
The user can search the wanted product by search field, by range of prices, or other filters suggested by buttons (all products, products in stock, categories of smarphones, laptops or other products). 
Every product have 4 options - 
1. "more details" that open product page with additional details.
2. "add to cart" button that add product to cart.
3. On admin permissions press on "edit" logo, will render edit page for "administrator"  that could change title/description/price per product on server and on DOM temporary till user click on "main page"/"add to cart" buttons.
4. On admin permmisions press on "delete" logo, will delete the item from localstorage and delete also on server and on DOM temporary till user click on "main page" button.
The cart updated dynamically and press on the logo of the cart will show all the products with their quantities, their prices per quantities and total price for all chosen products together.
in cart page the user could change the quantities or delete the products and the prices will updated dynamically in cart page and the quantities also on main page.
The design is responsive to different screen sizes (mobile/tablet/desktop).
The cart updated dynamically by using localstorage and the products in cart will be saved until the user will decide to delete them from the cart.