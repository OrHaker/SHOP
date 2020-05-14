import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext(); //Provider

class ProductProvider extends Component {
  constructor(props) {
    //one way to to set first state is to use ctor with the this keyword the other way is without ctor and props and without this keyword!
    super(props);
    this.state = {
      products: [],
      detailProduct: detailProduct,
      cart: [],
      modalOpen: false,
      modalProduct: detailProduct,
      cartSubTotal: 0,
      cartTax: 0,
      cartTotal: 0
    };
  }

  //on component mount we call setProducts function to set the products
  // details to get new set of values and not reference
  componentDidMount() {
    this.setProducts();
  }
  //set products to state
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  //get item from products array in state
  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  //handle details to show specific product details
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };

  //add product to cart
  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotals(); //callback function
      }
    );
  };

  //openModal small screen
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };

  //closeModal small screen
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  //increment cart item amount and price
  increment = id => {
    let tempCart = [...this.state.cart];
    //Find the specific object
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    //locate on memory and changing his reference
    const product = tempCart[index];
    product.count++;
    product.total = product.price * product.count;
    this.setState(
      () => {
        return { cart: [...tempCart] };
      },
      () => this.addTotals()
    );
    console.log(`${product.title} added 1 item more`);
  };

  //decrement cart item amount and price
  decrement = id => {
    let tempCart = [...this.state.cart];
    //Find the specific object
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    //locate on memory and changing his reference
    const product = tempCart[index];
    product.count--; //remove item from list
    if (product.count === 0) this.removeItem(id);
    else {
      product.total = product.price * product.count;
      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
        () => this.addTotals()
      );
    }
    console.log("decrement method");
  };

  //remove item from cart
  removeItem = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));
    //update removed item info
    let removeProduct = tempProducts[index];
    removeProduct.inCart = false;
    removeProduct.count = 0;
    tempCart.total = 0;
    this.setState(
      () => {
        return {
          cart: [...tempCart], //the cart array after changes
          products: tempProducts //products after updating info
        };
      },
      () => this.addTotals() //callback function
    );
    console.log(`${removeProduct.title} was removed`);
  };

  //clear all products and data from cart
  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        //callback function to reset all data and variables
        this.setProducts();
        this.addTotals();
      }
    );
  };

  //calculate total price
  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.17;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      };
    });
  };

  render() {
    return (
      //Provider
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

//Consumer
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
