const PRODUCTBOX = document.querySelector('.product__box');

fetch('catalog.json')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        let htmlCatalog = '';
        for(element of data){
            htmlCatalog += `<div class="product__element">
            <a href="#"><img class="product__img" src="${element.img}" alt="product-1"></a>
            <div class="product__content"> <a href="#" class="product__name">${element.name}</a>
            <p class="product__price">${element.price}</p>
            </div>
            <a href="#" class="product__add"><img class="product__cart" src="img/index/product/cart.png" alt="">Add
            to
            Cart</a>
            </div>
            `;
        }
        PRODUCTBOX.innerHTML = htmlCatalog;
    });