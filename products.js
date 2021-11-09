const PRODUCTBOX = document.querySelector('.product__box');

class Products {
    render() {
        let htmlCatalog = '';
        CATALOG.forEach(({
            id,
            name,
            price,
            img
        }) => {
            htmlCatalog += `  <div class="product__element">
                       <a href="#"><img class="product__img" src="${img}" alt="product-1"></a>
            <div class="product__content"> <a href="#" class="product__name">${name}</a>
                <p class="product__price">${price}</p>
            </div>
            <a href="#" class="product__add"><img class="product__cart" src="img/index/product/cart.png" alt="">Add
                to
                Cart</a>
                </div>
                    `;
        });

        PRODUCTBOX.innerHTML = htmlCatalog;
    }
}
const productsPage = new Products();
productsPage.render();