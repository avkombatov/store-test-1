const API = 'https://raw.githubusercontent.com/avkombatov/store-test-1/test-3';

class ProductList {
    constructor(container = '.product__box') {
        this.container = container;
        this._goods = []; // полученные данные с сервера
        this._allProducts = []; // готовые объекты товаров
        this.getProducts().then((data) => {
            this._goods = [...data];
            this._render();
            console.log(this.sum());
        });
    }

    getProducts() {
        return fetch(`${API}/catalog.json`)
            .then(response => response.json())
            .catch((error) => {
                console.log(error);
            });
    }

    sum() {
        return this._goods.reduce((sum, {
            price
        }) => sum + price, 0); // общая сумма goods
    }
    _render() {
        const block = document.querySelector(this.container);

        for (let product of this._goods) {
            const productObject = new ProductItem(product);
            // console.log(product);
            this._allProducts.push(productObject);

            block.insertAdjacentHTML('beforeend', productObject._getHtml());
        }
    }

}

class ProductItem {
    constructor(product) {
        this.id = product.id;
        this.img = product.img;
        this.name = product.name;
        this.price = product.price;
    }
    _getHtml() {
        return `<div class="product__element data-id="${this.id}">
<a href="#"><img class="product__img" src="${this.img}" alt="product-1"></a>
<div class="product__content"> <a href="#" class="product__name">${this.name}</a>
<p class="product__price">$ ${this.price} </p>
</div>
<a href="#" class="product__add"><img class="product__cart" src="img/index/product/cart.png" alt="">Add
to
Cart</a>
</div>
`;
    }
}
new ProductList();