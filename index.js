'use strict'

// Global variables
let data;
let optionChosen;
let userContent;
var cartArr=[];
let elmProducedProductOnDom;
let elmContainer;
let totalPriceElm;
let quantityPerId = {};
let idArr=[];
let pricesPerProductID=[];
let totalPricePerProduct
let pricePerUnit;
let quantity;
let totalPriceAll=0;
let deletFlag=0;
let elmToDelete;
let currentIndex;
let editTitleVal;
let editDescriptionVal;
let editPriceVal;
let pricePerIdObj={};

//  Global elements
let elmDivAddProducts=document.querySelector("#divAddProducts");
let numOfProductsOnCart= document.querySelector("#numOfProductsOnCart");
const elmInputByUser = document.querySelector("#searchInput");
const elmBtnSearch = document.querySelector("#btnSearch");
let elmListOfProductSearched = document.querySelector("#listOfProductSearched");
const elmBtnAllProducts=document.querySelector("#btnAllProducts");
const elmBtnProductsInStock=document.querySelector("#btnProductsInStock");
const elmBtnFilterSmartphones=document.querySelector("#btnFilterSmartphones");
const elmBtnFilterLaptops=document.querySelector("#btnFilterLaptops");
const elmBtnFilterOthers=document.querySelector("#btnFilterOthers");
const elmSelectPrice=document.querySelector("#selectByPrice");
const elmBody=document.querySelector("#body");


// first function to run after DOM content loaded
const enableDOMnewContent = async() => {
// fetch data from server to local, in "data" global variable
// delete flag initialized 0, after deleted items it will change to 1 
    if(deletFlag===0){
    const response = await fetch('https://dummyjson.com/products?limit=0');
    data = await response.json();}
// Listeners to filters by buttons or changes on search fields
    elmBtnAllProducts.addEventListener('click',()=>{
        fetchData(0);
    })
    elmBtnProductsInStock.addEventListener('click',()=>{
        fetchData(1);
    })
    elmBtnFilterSmartphones.addEventListener('click',()=>{
        fetchData(2)
    })
    elmBtnFilterLaptops.addEventListener('click',()=>{
        fetchData(3)
    })
    elmBtnFilterOthers.addEventListener('click',()=>{
        fetchData(4)
    })
    elmSelectPrice.addEventListener("change",()=>{
        optionChosen=elmSelectPrice.value
        if(optionChosen!==0){
        fetchData(5)
        }
    })
    elmBtnSearch.addEventListener("click", () => {
        userContent = elmInputByUser.value;
        fetchData(6);
});
    elmInputByUser.addEventListener("keyup",()=>{
        userContent = elmInputByUser.value;
        fetchData(7);
    })
}

// Rendered the filtered data according to user activity ( by buttons filter or on search fields) 
const fetchData = (index) => {
    if(index===0){
    currentIndex=0;
    buildMainPageAllProducts(data.products.length);
    }
    else if(index===1){
    currentIndex=1;
    buildMainPageInStock(data.products.length);
    }
    else if (index===2){
    currentIndex=2;
    buildMainPageSmartphones(data.products.length)
    }
    else if (index===3){
    currentIndex=3;
    buildMainPageLaptops(data.products.length)
    }
    else if (index===4){
    currentIndex=4;
    buildMainPageOthers(data.products.length)
    }
    else if(index===5){
    currentIndex=5;
    buildMainPageByPrice(data.products.length,optionChosen)
    }
    else if(index===6){
    currentIndex=6;    
    buildMainPageBasedOnSearch(data.products.length,
    userContent)}
    else if (index==7){
    produceSearchItems(data.products.length,userContent)
    }
}

// Activated when press on "logo" of the web, by clicking on it, will reloade the page
const reloadMainPaige = () =>{
    window.location.reload();
}

// Clear all fields after user set a new filter
const clearFields = () => {
    elmInputByUser.value=""
    elmListOfProductSearched.innerHTML="";
    elmDivAddProducts.innerHTML=''
}

// ------------------------------------------------------------------
// 6 functions that used for "update" products by clicking on "edit" button
// ------------------------------------------------------------------

// Update the changes edited ---> temporary on server switch cases ( title/description/price)  
const updateProductOnServer= async (idToEdit,fieldToChange)=>{
    let updatesToProduct={};
switch (fieldToChange) {
    case "title":
        updatesToProduct = {
            title: editTitleVal,
        }
        break;
        case "description":
            updatesToProduct = {
    description: editDescriptionVal,
}
    break;
    case "price":
    updatesToProduct = {
    price: editPriceVal,
}
break;
}
const updateOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( updatesToProduct )
}
const response = await fetch(`https://dummyjson.com/products/${idToEdit}`, updateOptions)
const dataPerId = await response.json()
data.products[idToEdit-1]=dataPerId;
renderProductPage(idToEdit)
}

// Edit title of product
const editTitleOnServer=(idToEdit)=>{
    const fieldToChange="title";
    updateProductOnServer(idToEdit,fieldToChange);
}

// Edit description of product
const editDescriptionOnServer=(idToEdit)=>{
    const fieldToChange="description";
    updateProductOnServer(idToEdit,fieldToChange);
}

// Edit price of product
const editPriceOnServer=(idToEdit)=>{
    const fieldToChange="price";
    if(isNaN(editPriceVal)){
        alert("NOT A NUMBER!");
        return;
    }
    updateProductOnServer(idToEdit,fieldToChange);
}

// Render the Edited page by administrator  
const renderEditPage=(idToEdit)=>{
    const html=`<div id="containerEditPage"><h1 id="h1EditPage"> Edit product ID number ${idToEdit} <br>on server</h1>
    <div><h3 class="h3TitlesEditPage">Title</h3><input id="titleEditInput" class="inputsEditPage"><button id="btnEditTitle" class="editBtns">Edit</button></div>
    <div><h3 class="h3TitlesEditPage">Description</h3><input id="descriptionEditInput" class="inputsEditPage"><button id="btnEditDescription" class="editBtns">Edit</button></div>
    <div><h3 class="h3TitlesEditPage">price</h3><input id="priceEditInput" class="inputsEditPage"><button id="btnEditPrice" class="editBtns">Edit</button></div>
    <button id="mainPageEditPage" onclick="mainPage()">Main Page</button></div>`
    elmBody.innerHTML=html;
    // elements allocation
    let elmTitleEditInput=document.querySelector("#titleEditInput");
    let elmDescriptionEditInput=document.querySelector("#descriptionEditInput");
    let elmPriceEditInput=document.querySelector("#priceEditInput");
    let elmBtnEditTitle=document.querySelector("#btnEditTitle");
    let elmBtnEditDescription=document.querySelector("#btnEditDescription");
    let elmBtnEditPrice=document.querySelector("#btnEditPrice");
    // onclick will send to function that edit the product
    elmBtnEditTitle.addEventListener("click",()=>{
    editTitleVal=elmTitleEditInput.value;
    editTitleOnServer(idToEdit) 
    })
    elmBtnEditDescription.addEventListener("click",()=>{
    editDescriptionVal=elmDescriptionEditInput.value;
    editDescriptionOnServer(idToEdit) 
    })
    elmBtnEditPrice.addEventListener("click",()=>{
    editPriceVal=parseInt(elmPriceEditInput.value);
    editPriceOnServer(idToEdit) 
    })
}

// Style the "edit" buttons 
const editProduct =  (idToEdit) =>{
        let elmToEdit=document.querySelector(`#editBtn${idToEdit}`);
    setTimeout(function () {
    elmToEdit.style.transition = 'transform 0s ease-in-out'; 
    elmToEdit.style.transform = 'scale(1.3)';
    }, 0);  
    setTimeout(function () {
    elmToEdit.style.transition = 'none';
    elmToEdit.style.transform = 'scale(1)';
    }, 100); 
    setTimeout(function () {
    renderEditPage(idToEdit);
    }, 150); 

} 
// ------------------------------------------------------------------
// Finish of 6 functions that used for "update" products by clicking on "edit" button
// ------------------------------------------------------------------

//  Delete the product from server
const deleteProductFromServer=async (idToRemove) =>{
    // delete id from server
    const response= await fetch (`https://dummyjson.com/products/${idToRemove}`,{method:"DELETE"})
    const deletedData=await response.json();
    // transition of the button
    let elmToDelete=document.querySelector(`#deleteBtn${idToRemove}`);
    setTimeout(function () {
    elmToDelete.style.transition = 'transform 0s ease-in-out'; 
    elmToDelete.style.transform = 'scale(1.3)';
    }, 0);  
    setTimeout(function () {
    elmToDelete.style.transition = 'none';
    elmToDelete.style.transform = 'scale(1)';
    }, 100); 
    // if we got delete status from DOM 
    if(deletedData.isDeleted){
    deletFlag=1;
    data.products=data.products.filter(idToDel=>idToDel.id!==idToRemove);
    // remove temporary from localStorage and from DOM 
    window.localStorage.removeItem(idToRemove);
    updateCartQuantity();
    pricesPerProductID=[];
    idArr=[];
    updatePricesOfProducts();
    setTimeout(function () {
    fetchData(currentIndex);
    }, 150); 
    }
    // if delete status not updated on server 
    else{return}
}

// Page creates per product by clicking on "more details" button
const renderProductPage=(id)=>
{   
    const html = `<h1 id="hProductDetails">Product details</h1>
    <div id="divMoreDetails"></div>
    <script  src="index.js"></script>`
    elmBody.innerHTML=html;
    let elmDivMoreDetails = document.querySelector("#divMoreDetails");
    const title=data.products[id-1].title;
    const category=data.products[id-1].category;
    const description=data.products[id-1].description;
    const price=data.products[id-1].price;
    const image=data.products[id-1].thumbnail;
    const htmlProductDetails = `<h2 id="title">${title}</h2><h3 id="category">Category: ${category}</h3><p id="description">${description}</p><img id="imgOfProduct" src=${image}><h3 id="price">Price: ${price}$</h3>
    <div id="btnsProductDetails">
    <button onclick="addToCart(${id})" class="btnsAddToCartProductPage">add to cart</button>
    <button onclick="mainPage()" class="mainPageBtn">main page<button>
    </div>`
    elmDivMoreDetails.innerHTML+=htmlProductDetails
}

// Render all products that filtered by clicked or searched by user 
const productsOnDOM = (i) =>{
        elmDivAddProducts.innerHTML+=`
        <div id="divProduct${i}" class="divProducts">
        <h1 class="titles">${data.products[i].title}</h1>
        <img class="imgOfProducts" src="${data.products[i].thumbnail}">
        <p class="descriptionProducts">${data.products[i].description}</p>
        <div id="btnsOfPrivateProducts">
        <btn onclick="addToCart(${data.products[i].id})" id="btnAddToCart" class="btnsPerProduct">add to cart</btn>
        <btn onclick="renderProductPage(${data.products[i].id})" id="btnMoreDetails" class="btnsPerProduct">more details</btn>
        </div>
        <div class="adminLogosDiv">
        <p class="adminPermissionP">Admin permissions</p>
        <img onclick="editProduct(${data.products[i].id})" title="Edit" id="editBtn${data.products[i].id}" class="adminLogos" src="/images/editing.png"><img onclick="deleteProductFromServer(${data.products[i].id})" title="Delete" id="deleteBtn${data.products[i].id}" class="adminLogos" src="/images/delete.png"></div>
        </div>
        `
        const adminPermissionP=document.querySelectorAll('.adminPermissionP');
        for(let i=0;i<adminPermissionP.length;i++){
        adminPermissionP[i].addEventListener("click",()=>{alert("Please click on the wanted logo")})
        }
}

// fucntion that will activate on click "search" button
const produceSearchItems = (dataLength,search) => {
    elmListOfProductSearched.innerHTML="";
    for(let i=0; i<dataLength;i++){
        if (elmInputByUser.value===""){break}
        const productTitle = data.products[i].title;
        if (productTitle.toLowerCase().includes(search)){
            const newLiElm=document.createElement("li");
            newLiElm.setAttribute('id', `productId${i}`);
            newLiElm.setAttribute('class','productsFromSearch');
            const text = document.createTextNode(productTitle);
            newLiElm.appendChild(text);
            elmListOfProductSearched.appendChild(newLiElm);
            newLiElm.onclick=function() {
                elmInputByUser.value=productTitle.toLowerCase()
                elmListOfProductSearched.innerHTML="";
                userContent = elmInputByUser.value;
                fetchData(6);
            }
        }
        }
    }

// fucntion that will activate by click on "All products" button
const buildMainPageAllProducts=(productLength)=>{
    clearFields();
    for(let i=0;i<productLength;i++){
    productsOnDOM(i)
    }
}

// fucntion that will activate by click on "Products in stock" button
const buildMainPageInStock=(productLength)=>{
    clearFields();
    for(let i=0;i<productLength;i++){
        if(data.products[i].stock>=50){
        productsOnDOM(i)
        }
    }
}

// fucntion that will activate by click on "Smartphones" button
const buildMainPageSmartphones = (dataLength)=>{
    clearFields();
for(let i=0;i<dataLength;i++){
    if(data.products[i].category=="smartphones"){
        productsOnDOM(i)
    }
}
}

// fucntion that will activate by click on "Laptops" button
const buildMainPageLaptops = (dataLength)=>{
    clearFields();
for(let i=0;i<dataLength;i++){
    if(data.products[i].category=="laptops"){
        productsOnDOM(i)
    }
}
}

// fucntion that will activate by click on "Other products" button
const buildMainPageOthers = (dataLength)=>{
clearFields();
for(let i=0;i<dataLength;i++){
    if(data.products[i].category!=="smartphones"&& data.products[i].category!=="laptops"){
        productsOnDOM(i)
    }
}
}

// fucntion that will activate by change range of prices
const buildMainPageByPrice=(dataLength,optionChosen)=>{
    clearFields();
    for(let i=0;i<=dataLength-1;i++){
        if(data.products[i].price<=optionChosen && data.products[i].price>=optionChosen-500 ){
            productsOnDOM(i)}
}
}

// fucntion that will activate by change on search field
const buildMainPageBasedOnSearch=(dataLength,userContent)=>{
clearFields();
elmInputByUser.value=userContent
userContent.toLowerCase();
for(let i=0;i<dataLength;i++){
    if(data.products[i].title.toLowerCase().includes(userContent)){
    productsOnDOM(i)
}
}
}

// fucntion that will activate on click "add to cart" button and will update the local storage with key=id, value=quantity
const addToCart=(productId)=>{
        cartArr.push(productId);
        quantityPerUnit();
        saveCartOnLocalStorage();
        numOfProductsOnCart.innerHTML++
        cartArr=[];
}

// when user press on one of the "Main page" buttons, window will reloaded
const mainPage = ()=>{
setTimeout(() => {
    window.location.reload();
    }, 1000);
}

// Render the cart page
const produceCartPage=()=>{
    elmBody.innerHTML=''
    const html=`<div id="container">
    <h1 id="h1CartPage">Cart Page</h1>
    <p id="products">The cart is empty</p>
    <div id="totalPrice"></div>
    <div id="divBtnsCartPage">
    <button onclick="buyProducts()" id="buyBtn">Buy</button>
    <button onclick="mainPage()" class="mainPageBtn">main page<button>
    </div>
    </div>
    <script src="./index.js"></script>`
    // initialized the elements related to cart page
    elmBody.innerHTML=html;
    elmProducedProductOnDom=document.querySelector("#products");
    elmContainer=document.querySelector("#container");
    totalPriceElm=document.querySelector("#totalPrice");
}

// When ONLOAD DOM happends as first thing, it takes the data from LocalStorage and update the cart quantities
const updateCartQuantity= ()=>{
quantityPerId={}
let totalQuantity=0;
for (let i = 0; i < localStorage.length; i++) {
const key = parseInt(localStorage.key(i));
const value = parseInt(localStorage.getItem(key));
quantityPerId[key]=value;
totalQuantity+=value
}
numOfProductsOnCart.innerHTML=totalQuantity;
}

// Save the added products to localStorage
const saveCartOnLocalStorage=()=>{
    localStorage.clear();
    for(let key in quantityPerId ){
    localStorage.setItem(key,JSON.stringify(quantityPerId[key]))
    }
}

// Adding the cart aditional data then rerender it    
const produceOnDom =  () =>{
    elmProducedProductOnDom.innerHTML=''
    updateCartQuantity();
    // quantityPerUnit();
    checkIfCartClear();
    updatePricesOfProducts()
    saveCartOnLocalStorage()
    renderCart()
}

// Press on "cart" logo will activate the function: 
// First goes to function that render the basic cart page, then goes to function that added the cart page aditional data   
const openCartPage = () => {
    // produce the products on DOM
    produceCartPage();
    produceOnDom();
}

// Check if the cart clear from products
const checkIfCartClear =() =>{
        if(Object.keys(quantityPerId).length===0){
        totalPriceElm.innerHTML=''
        elmProducedProductOnDom.innerHTML="The cart is empty"
        window.localStorage.clear();
    };
}

//  Update object of key=id value=prices
const updateQuantityAndPricePerProductsArray = ()=>{
    for(let key in pricePerIdObj ){
        const parseKeyToInt=parseInt(key);    
        idArr.push(parseKeyToInt);
        pricesPerProductID.push(pricePerIdObj[key]);
    }
}

// Update the prices related to quantity per product that user choose from cart page 
const updatePricesOfProducts= ()=>{
    pricePerIdObj={};
    for(let key in quantityPerId ){
        const parseKeyToInt=parseInt(key);
        for(let i=0;i<data.products.length;i++){
            if(data.products[i].id===parseKeyToInt){
                const pricePerId= data.products[i].price;        
                pricePerIdObj[parseKeyToInt]=pricePerId;    
            }
        }
    }
    updateQuantityAndPricePerProductsArray();
}

// Update the object quantityPerId that save quantity per Id
const quantityPerUnit = () =>{
    cartArr.forEach(element => {
        if(quantityPerId[element]){
            quantityPerId[element]++;
        }
        else{quantityPerId[element]=1}
    });
}

// Will activate when user press on "X" button and remove product from cart, in addition remove from Local storage 
const removeFromCart = (productId) => {
// remove id and quantity from object hold quantity per id
delete quantityPerId[productId]
window.localStorage.removeItem(productId);
// delete the element of this product from cart page DOM
const divToDelete=document.querySelector(`#divProduct${productId}`)
divToDelete.innerHTML=''
totalPriceAll=0;
elmProducedProductOnDom.innerHTML=''
checkIfCartClear();
pricesPerProductID=[];
idArr=[];
updatePricesOfProducts()
renderCart()
}

// Update the total price of all products together
const updateTotalPriceAll = (id,quantity) => {
    totalPriceAll=0;
    const parseToIntQuantity=parseInt(quantity);
// updating the quantity per id, then clean the products on cart page DOM
    quantityPerId[id]=parseToIntQuantity;
    const html=``
    elmProducedProductOnDom.innerHTML=html
// render the cart page with updated quantities
    renderCart()
}

// Render the Cart page with all elements inside
const renderCart = () =>{
    let productTitle;
    for(let key in quantityPerId){ 
        const parseKeyToInt=parseInt(key);    
        const productId=parseKeyToInt;
        quantity=quantityPerId[parseKeyToInt]
        for(let i=0;i<data.products.length;i++){
            if(data.products[i].id===parseKeyToInt){
                productTitle=data.products[[key]-1].title
                pricePerUnit= data.products[i].price;        
        }
    }

        totalPricePerProduct=parseInt(quantity)*parseInt(pricePerUnit);
        totalPriceAll+=totalPricePerProduct;
        const html=`<div id="divProduct${productId}" class="divProduct"><span id="title${productId}" class="title">${productTitle}</span><span><select id="selectQuantity${productId}"class="selectQuantity"><option>${quantity}</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><span id="totalPricePerProduct${key}" class="totalPricePerProductClass">$${totalPricePerProduct}</span><button onclick="removeFromCart(${productId})" class="cancelProductBtn">X</button></span><br></div>`
        elmProducedProductOnDom.innerHTML+=html
        const selectQuantityElm = document.querySelectorAll(".selectQuantity")
        const totalPricePerProductElm=document.querySelectorAll(".totalPricePerProductClass")
        // for loop over the quantity - in order to calculate the prices
        // if there's any change on quantity, will update it.
        for(let i=0; i<selectQuantityElm.length;i++){
        let quantity;
        let price = pricesPerProductID[i]
        selectQuantityElm[i].addEventListener("change",()=>{
            quantity=selectQuantityElm[i].value;
            let id=idArr[i]
            totalPricePerProductElm[i].innerHTML=`$${quantity*price}`
            quantityPerId[id]=quantity;
            updateTotalPriceAll(id,quantity);
            saveCartOnLocalStorage();
            })
        }
    }
    if(totalPriceAll!==0)
    {
        totalPriceElm.innerHTML=`Total Price: $${totalPriceAll}`
    }
}

// Arriving from "click" event from HTML "buy" button   
const buyProducts=()=>{
        if(Object.keys(quantityPerId).length==0){
            alert("Your cart is empty, add some products, then buy :)")
        } else {const html = `<h1 id="buyingTitle">Dear costumer, thanks for chosing us,<br> proccess done successfuly. 😀<br> Products will deliver to you ASAP! 🚚</h1>`
        elmContainer.innerHTML=html

    }
}

// When Dom loaded, first loaded Data from server, then update the object that holds quantity per ID.
document.addEventListener("DOMContentLoaded", ()=>{
        enableDOMnewContent();
        updateCartQuantity()
})