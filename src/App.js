// App Component
// Root Component
// Contains all handle methods of the app

import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.scss";

import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import products from "./data/products.json";

class App extends Component {
  constructor(props) {
    super(props);
    console.log(products);
    this.state = {
      products: products,
      cart: {
        items: [],
        total: 0,
      },
      favorites: [],
      categories: [],
      currency: "₴",
      displayedProducts: products.map((product) => product.id),
      productsSortBy: "default",
      productsFilterSliderValues: [0, 180],
      popupOnBuyProduct: { showPopup: false, product: null },
      buyProductInterface: { quantity: 1, selectedValue: null },
      containerScrollPosition: [0, 0, 0, 0, 0, 0],
    };
  }

  componentDidMount() {
    // Copying products from current state
    const products = [...this.state.products];
    // Each product that is on sale, add the category "Sale"
    products.forEach((product) => {
      if (product.sale !== null) {
        product.categories.push("Sale");
      }
    });

    // Setting the new state
    this.setState({ products: products });

    // Merging the category arrays from products and removing duplicats
    const categorieSet = [
      ...new Set(
        [].concat.apply(
          [],
          this.state.products.map((item) => item.categories)
        )
      ),
    ];

    // Creating an array of objects consisting of the categories from categorieSet and their respective productCount
    const categories = categorieSet.map((item) => {
      return {
        name: item,
        productCount: products.filter((product) =>
          product.categories.includes(item)
        ).length,
      };
    });

    // Sorting categories by their productCount
    const categoriesSorted = categories.sort((prev, next) =>
      prev.productCount < next.productCount ? 1 : -1
    );

    // Setting the state for categories
    this.setState({ categories: categoriesSorted });

    // If cart is set in storage, update cart in state with data out of localStorage
    if (localStorage.getItem("cart") !== null) {
      this.setState({ cart: JSON.parse(localStorage.getItem("cart")) });
    }

    // If favorites is set in storage, update favorites in state with data out of localStorage
    if (localStorage.getItem("favorites") !== null) {
      this.setState({
        favorites: JSON.parse(localStorage.getItem("favorites")),
      });
    }
  }

  handleIncrementProduct = (
    product,
    selectedValue = product.sizes[0],
    quantity = 1
  ) => {
    // Copying cart from current state
    const cart = { ...this.state.cart };

    /* START - Adjusting array of cart.items */
    // Copying cart.items from current state
    const cartItems = [...this.state.cart.items];

    // If an item with the selected value isn't already in cart, create one and push it to the array; otherwise copy from current state
    if (cartItems.filter((p) => p.productID === product.id).length === 0) {
      cartItems.push({
        cartID: cartItems.length,
        productID: product.id,
        quantity: 0,
        selectedValue: selectedValue,
      });
    } else if (
      cartItems.filter((p) => p.productID === product.id).length > 0 &&
      cartItems
        .filter(
          (p) => p.productID === product.id && p.selectedValue === selectedValue
        )
        .map((p) => p.selectedValue)[0] !== selectedValue
    ) {
      cartItems.push({
        cartID: cartItems.length,
        productID: product.id,
        quantity: 0,
        selectedValue: selectedValue,
      });
    } else {
      const index = cartItems.indexOf(
        cartItems.filter(
          (item) =>
            item.productID === product.id &&
            item.selectedValue === selectedValue
        )[0]
      );
      cartItems[index] = {
        ...this.state.cart.items[index],
      };
    }

    // Determine index of cartItem
    const index = cartItems.indexOf(
      cartItems.filter(
        (item) =>
          item.productID === product.id && item.selectedValue === selectedValue
      )[0]
    );

    // Increment quantity of cartItem
    cartItems[index].quantity += quantity;

    // Replace old items array with new one
    cart.items = cartItems;
    /* END - Adjusting array of cart.items */

    /* START - Adjusting value of cart.total */
    // Copying cart.total from current state
    let cartTotal = this.state.cart.total;

    // Increase cartTotal by price of bought product
    cartTotal += (product.sale ? product.sale : product.price) * quantity;

    // Replace old total value with new one
    cart.total = cartTotal;
    /* END - Adjusting value of cart.total */

    // Setting the new state and saving cart in localStorage
    this.setState({ cart: cart }, () => {
      localStorage.setItem("cart", JSON.stringify(this.state.cart));
    });
  };

  handleDecrementProduct = (product, selectedValue) => {
    // Copying cart from current state
    const cart = { ...this.state.cart };

    /* START - Adjusting array of cart.items */
    // Copying cart.items from current state
    const cartItems = [...this.state.cart.items];

    // Determine index of cartItem
    const index = cartItems.indexOf(
      cartItems.filter(
        (item) =>
          item.productID === product.id && item.selectedValue === selectedValue
      )[0]
    );

    // If an item has only one quantity in cart remaining, remove it from the array; otherwise decrement cartItem
    if (cartItems[index].quantity === 1) {
      cartItems.splice(index, 1);
    } else {
      // Decrement quantity of cartItem
      cartItems[index].quantity--;
    }

    // Replace old items array with new one
    cart.items = cartItems;
    /* END - Adjusting array of cart.items */

    /* START - Adjusting value of cart.total */
    // Copying cart.total from current state
    let cartTotal = this.state.cart.total;

    // Decrease cartTotal by price of bought product
    cartTotal -= product.sale ? product.sale : product.price;

    // Replace old total value with new one
    cart.total = cartTotal;
    /* END - Adjusting value of cart.total */

    // Setting the new state and saving cart in localStorage
    this.setState({ cart: cart }, () => {
      localStorage.setItem("cart", JSON.stringify(this.state.cart));
    });
  };

  handleRemoveProduct = (product, selectedValue) => {
    // Copying cart from current state
    const cart = { ...this.state.cart };

    /* START - Adjusting array of cart.items */
    // Copying cart.items from current state
    const cartItems = [...this.state.cart.items];

    // Determine index of cartItem
    const index = cartItems.indexOf(
      cartItems.filter(
        (item) =>
          item.productID === product.id && item.selectedValue === selectedValue
      )[0]
    );

    // Determine quantity of cartItem in cart
    const quantity = cartItems[index].quantity;

    // Remove cartItem
    cartItems.splice(index, 1);

    // Replace old items array with new one
    cart.items = cartItems;
    /* END - Adjusting array of cart.items */

    /* START - Adjusting value of cart.total */
    // Copying cart.total from current state
    let cartTotal = this.state.cart.total;

    // Decrease cartTotal by price of bought product
    cartTotal -= (product.sale ? product.sale : product.price) * quantity;

    // Replace old total value with new one
    cart.total = cartTotal;
    /* END - Adjusting value of cart.total */

    // Setting the new state and saving cart in localStorage
    this.setState({ cart: cart }, () => {
      localStorage.setItem("cart", JSON.stringify(this.state.cart));
    });
  };

  handleRemoveAllProducts = () => {
    // Copying cart from current state
    const cart = { ...this.state.cart };

    /* START - Adjusting array of cart.items */

    // Remove cartItem
    const cartItems = [];

    // Replace old items array with new one
    cart.items = cartItems;
    /* END - Adjusting array of cart.items */

    /* START - Adjusting value of cart.total */
    // Decrease cartTotal by price of bought product
    const cartTotal = 0;

    // Replace old total value with new one
    cart.total = cartTotal;
    /* END - Adjusting value of cart.total */

    // Setting the new state and saving cart in localStorage
    this.setState({ cart: cart }, () => {
      localStorage.setItem("cart", JSON.stringify(this.state.cart));
    });
  };

  handleFavorite = (product) => {
    // Copying favorites from current state
    const favorites = [...this.state.favorites];

    // If an item isn't already a favorite, create one and push it to the array; otherwise remove it from the array
    if (favorites.filter((p) => p.productID === product.id).length !== 1) {
      favorites.push({
        productID: product.id,
      });
    } else {
      const index = favorites.indexOf(
        favorites.filter((item) => item.productID === product.id)[0]
      );
      favorites.splice(index, 1);
    }

    // Setting the new state and saving favorites in localStorage
    this.setState({ favorites: favorites }, () => {
      localStorage.setItem("favorites", JSON.stringify(this.state.favorites));
    });
  };

  handleSort = (sortBy) => {
    // Copying products and productsSortBy from current state
    const products = [...this.state.products];
    const productsSortBy = sortBy;

    // Sorting by default order
    if (productsSortBy === "default") {
      products.sort((prev, next) => {
        if (prev.id > next.id) return 1;
        else if (prev.id < next.id) return -1;
        else return 0;
      });
    } else {
      // Declaring the sortValue
      let sortValue;

      // Defining the sortValue
      if (productsSortBy === "ascending") sortValue = 1;
      else if (productsSortBy === "descending") sortValue = -1;

      // Sorting the products array in regards to sortValue
      products.sort((prev, next) => {
        if (
          (prev.sale ? prev.sale : prev.price) >
          (next.sale ? next.sale : next.price)
        )
          return sortValue;
        else if (
          (prev.sale ? prev.sale : prev.price) <
          (next.sale ? next.sale : next.price)
        )
          return -sortValue;
        else return 0;
      });
    }

    // Setting the new state
    this.setState({
      products: products,
      productsSortBy: productsSortBy,
    });
  };

  handleSliderChange = (sliderValues) => {
    // Copying products and productsFilterSliderValues from current state
    let products = [...this.state.products];
    const productsFilterSliderValues = sliderValues;

    // Filtering the products regarding to price span
    const displayedProducts = products
      .filter(
        (product) =>
          (product.sale ? product.sale : product.price) >=
            productsFilterSliderValues[0] &&
          (product.sale ? product.sale : product.price) <=
            productsFilterSliderValues[1]
      )
      .map((product) => product.id);

    // Setting the new state
    this.setState({
      displayedProducts: displayedProducts,
      productsFilterSliderValues: productsFilterSliderValues,
    });
  };

  handleTogglePopup = (product = null) => {
    // Setting the new state with boolean whether popup is open or not
    this.setState({
      popupOnBuyProduct: {
        showPopup: !this.state.popupOnBuyProduct.showPopup,
        product: product,
      },
    });
  };

  handleInterfaceIncrementQuantity = () => {
    // Copying buyProductInterface from current state
    const buyProductInterface = { ...this.state.buyProductInterface };

    // Increment quantity
    buyProductInterface.quantity++;

    // Setting the new state
    this.setState({ buyProductInterface: buyProductInterface });
  };

  handleInterfaceDecrementQuantity = () => {
    // Copying buyProductInterface from current state
    const buyProductInterface = { ...this.state.buyProductInterface };

    // If quantity > 1, decrement quantity
    if (buyProductInterface.quantity > 1) buyProductInterface.quantity--;

    // Setting the new state
    this.setState({ buyProductInterface: buyProductInterface });
  };

  handleInterfaceReset = () => {
    // Copying buyProductInterface from current state
    const buyProductInterface = { ...this.state.buyProductInterface };

    // Resetting values of buyProductInterface
    buyProductInterface.quantity = 1;
    buyProductInterface.selectedValue = null;

    // Setting the new state
    this.setState({ buyProductInterface: buyProductInterface });
  };

  handleInterfaceSelectChange = (value) => {
    // Copying buyProductInterface from current state
    const buyProductInterface = { ...this.state.buyProductInterface };

    // Setting selectValue to the changed value
    buyProductInterface.selectedValue = value;

    // Setting the state with the new selected value
    this.setState({ buyProductInterface: buyProductInterface });
  };

  handleStoreScrollPosition = (scrollContainerID, scrollPos) => {
    // Copying containerScrollPosition from current state
    const containerScrollPosition = [...this.state.containerScrollPosition];

    // Setting containerScrollPosition to the changed value
    containerScrollPosition[scrollContainerID] = scrollPos;

    // Setting the new state
    this.setState({ containerScrollPosition: containerScrollPosition });
  };

  render() {
    const {
      products,
      cart,
      favorites,
      categories,
      currency,
      displayedProducts,
      productsSortBy,
      productsFilterSliderValues,
      popupOnBuyProduct,
      buyProductInterface,
      containerScrollPosition,
    } = this.state;

    return (
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Navbar
            cartItemsCount={cart.items
              .map((item) => item.quantity)
              .reduce((prev, next) => prev + next, 0)}
          />
          <Content
            products={products}
            cart={cart}
            favorites={favorites}
            categories={categories}
            currency={currency}
            displayedProducts={displayedProducts}
            productsSortBy={productsSortBy}
            productsFilterSliderValues={productsFilterSliderValues}
            popupOnBuyProduct={popupOnBuyProduct}
            buyProductInterface={buyProductInterface}
            containerScrollPosition={containerScrollPosition}
            onIncrementProduct={this.handleIncrementProduct}
            onDecrementProduct={this.handleDecrementProduct}
            onRemoveProduct={this.handleRemoveProduct}
            onRemoveAllProducts={this.handleRemoveAllProducts}
            onFavorite={this.handleFavorite}
            onSort={this.handleSort}
            onSliderChange={this.handleSliderChange}
            onTogglePopup={this.handleTogglePopup}
            onInterfaceIncrementQuantity={this.handleInterfaceIncrementQuantity}
            onInterfaceDecrementQuantity={this.handleInterfaceDecrementQuantity}
            onInterfaceReset={this.handleInterfaceReset}
            onInterfaceSelectChange={this.handleInterfaceSelectChange}
            onStoreScrollPosition={this.handleStoreScrollPosition}
          />
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
