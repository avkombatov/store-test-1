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

class ProductsList extends List {
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
                console.log(e.target);
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
<div class="product__add" data-id="${this.id}" data-img="${this.img}"
data-name="${this.name}"
data-price="${this.price}"><img class="product__cart" src="img/index/product/cart.png" alt="">Add
to
Cart</div>
</div>
`;
    }
}

class Cart extends List {
    constructor(container = ".drop__cart", url = "") {
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);
            });
    }

    addProduct(element) {
        console.log(element);
        this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id === productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id: productId,
                            img: element.dataset['img'],
                            price: +element.dataset['price'],
                            name: element.dataset['name'],
                            quantity: 1
                        };
                        // goods - это своего рода "опорный" массив, отражающий список товаров, которые нужно отрендерить.
                        // При добавлении нового товара, нас интересует только он один.
                        this.goods = [product];
                        // далее вызывая метод render, мы добавим в allProducts только его, тем самым избегая лишнего перерендера.
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    removeProduct(element) {
        console.log(element);
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    console.log(productId);
                    let find = this.allProducts.find(product => product.id === productId);
                    if (find.quantity > 1) { // если товара > 1, то уменьшаем количество на 1
                        find.quantity--;
                        this._updateCart(find);
                    } else { // удаляем
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        let a = document.querySelector(`.drop__cart_product[data-id="${productId}"]`);
                        console.log(a);
                        a.remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _updateCart(product) {
        let block = document.querySelector(`.drop__cart_product[data-id="${product.id}"]`);
        block.querySelector('.product-quantity').textContent = `rjkbxtcndh: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price} ₽`;
    }

    _init(){
        document.querySelector('.cart__a').addEventListener('click', () => {
          document.querySelector(this.container).classList.toggle('drop__invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {
          if(e.target.classList.contains('drop__delete')){
            this.removeProduct(e.target);
          }
        })
      }

}

class CartItem extends Item {
    constructor(el) {
        super(el);
        this.quantity = el.quantity;
       
    }
    render() {
        //   return `<div class="cart-item" data-id="${this.id}">
        //           <div class="product-bio">
        //           <img src="${this.img}" alt="Some image">
        //           <div class="product-desc">
        //           <p class="product-title">${this.name}</p>
        //           <p class="product-quantity">Количество: ${this.quantity}</p>
        //       <p class="product-single-price">${this.price} за ед.</p>
        //       </div>
        //       </div>
        //       <div class="right-block">
        //           <p class="product-price">${this.quantity*this.price} ₽</p>
        //           <button class="del-btn" data-id="${this.id_product}">&times;</button>
        //       </div>
        //       </div>`

        return `<div class="drop__cart_product" data-id="${this.id}">
    <a href="#" class="drop__cart_a"><img class="drop__cart_img"
            src="${this.img}" alt="foto"></a>
    <div class="drop__cart_descr">
        <a href="" class="drop__cart_h3">
            <h3 class="drop_cart_h3">${this.name}</h3>
        </a>
        <p class="product-quantity">Количество: ${this.quantity}</p>
         <p class="drop__cart_p product-quantity">${this.quantity*this.price}</p>
    </div>
    <i data-id="${this.id}" class="fas fa-times-circle drop__delete"></i>
</div>`
    }
}
//


const listContext = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);




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