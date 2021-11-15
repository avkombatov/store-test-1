const API = 'https://raw.githubusercontent.com/avkombatov/store-test-1/test-3';

class List {
    constructor(url, container, list = listContext) {
        this.container = container;
        this.list = list; // словарь для классов
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtred = []; //отфильтрованные товары
        this._init();
    }

    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    handleData(data) {
        this.goods = [...data];
        this.render();
    }

    calcSum() {
        return this.allProducts.reduce((accum, item) => accum = accum + item.price, 0);
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            console.log(this.constructor.name);
            const productObj = new this.list[this.constructor.name](product);
            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }

}

class Item {
    constructor(el) {
        this.id = el.id;
        this.img = el.img;
        this.price = el.price;
        this.name = el.name;

    }
    render() {
        return '';
    }
}

class Produtslist extends List {
    constructor(cart, container = '.product__box', url = '/catalog.json') {
        super(url, container);
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('product__add')) {
                this.cart.addProduct(e.target);
            }
        });
        // document.querySelector('.search-form').addEventListener('submit', e => {
        //     e.preventDefault();
        //     this.filter(document.querySelector('.search-field').value)
        // })
    }

}

class ProductItem extends Item {
    render() {
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

class Cart extends List{
    constructor(container = ".drop__cart", url = "/getBasket.json"){
      super(url, container);
      this.getJson()
        .then(data => {
          this.handleData(data.contents);
        });
    }
}


const listContext = {
    ProductList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductList(cart);




// class ProductList {
//     constructor(container = '.product__box') {
//         this.container = container;
//         this._goods = []; // полученные данные с сервера
//         this._allProducts = []; // готовые объекты товаров
//         this.getProducts().then((data) => {
//             this._goods = [...data];
//             this._render();
//             console.log(this.sum());
//         });
//     }

//     getProducts() {
//         return fetch(`${API}/catalog.json`)
//             .then(response => response.json())
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     sum() {
//         return this._goods.reduce((sum, {
//             price
//         }) => sum + price, 0); // общая сумма goods
//     }
//     _render() {
//         const block = document.querySelector(this.container);

//         for (let product of this._goods) {
//             const productObject = new ProductItem(product);
//             // console.log(product);
//             this._allProducts.push(productObject);

//             block.insertAdjacentHTML('beforeend', productObject._getHtml());
//         }
//     }

// }

// class ProductItem {
//     constructor(product) {
//         this.id = product.id;
//         this.img = product.img;
//         this.name = product.name;
//         this.price = product.price;
//     }
//     _getHtml() {
//         return `<div class="product__element data-id="${this.id}">
// <a href="#"><img class="product__img" src="${this.img}" alt="product-1"></a>
// <div class="product__content"> <a href="#" class="product__name">${this.name}</a>
// <p class="product__price">$ ${this.price} </p>
// </div>
// <a href="#" class="product__add"><img class="product__cart" src="img/index/product/cart.png" alt="">Add
// to
// Cart</a>
// </div>
// `;
//     }
// }
// new ProductList();