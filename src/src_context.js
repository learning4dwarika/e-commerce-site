import React, { useState, useEffect, createContext } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [detailProductState, setDetailProduct] = useState(detailProduct);
    const [cart, setCart] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState(detailProduct);
    const [cartSubTotal, setCartSubTotal] = useState(0);
    const [cartTax, setCartTax] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        initializeProducts();
    }, []);

    const initializeProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = { ...item };
            tempProducts = [...tempProducts, singleItem];
        });
        setProducts(tempProducts);
    };

    const filterProducts = value => {
        value = value.toLowerCase();
        let filteredProducts = [];
        storeProducts.forEach(item => {
            if (
                item.title.toLowerCase().includes(value) ||
                item.info.toLowerCase().includes(value)
            ) {
                const singleItem = { ...item };
                filteredProducts = [...filteredProducts, singleItem];
            }
        });
        setProducts(filteredProducts);
    };

    const getItem = id => {
        return products.find(item => item.id === id);
    };

    const handleDetail = id => {
        const product = getItem(id);
        setDetailProduct(product);
    };

    const addToCart = id => {
        let tempProducts = [...products];
        const index = tempProducts.indexOf(getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        product.total = product.price;

        setProducts(tempProducts);
        setCart([...cart, product]);
        setDetailProduct({ ...product });
        addTotals();
    };

    const openModal = id => {
        const product = getItem(id);
        setModalProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const increment = id => {
        let tempCart = [...cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.count * product.price;

        setCart(tempCart);
        addTotals();
    };

    const decrement = id => {
        let tempCart = [...cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count - 1;

        if (product.count === 0) {
            removeItem(id);
        } else {
            product.total = product.count * product.price;
            setCart(tempCart);
            addTotals();
        }
    };

    const getTotals = () => {
        let subTotal = 0;
        cart.forEach(item => (subTotal += item.total));
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        return { subTotal, tax, total };
    };

    const addTotals = () => {
        const totals = getTotals();
        setCartSubTotal(totals.subTotal);
        setCartTax(totals.tax);
        setCartTotal(totals.total);
    };

    const removeItem = id => {
        let tempProducts = [...products];
        let tempCart = [...cart];

        const index = tempProducts.indexOf(getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        tempCart = tempCart.filter(item => item.id !== id);

        setCart(tempCart);
        setProducts(tempProducts);
        addTotals();
    };

    const clearCart = () => {
        setCart([]);
        initializeProducts();
        addTotals();
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                detailProduct: detailProductState,
                cart,
                modalOpen,
                modalProduct,
                cartSubTotal,
                cartTax,
                cartTotal,
                handleDetail,
                addToCart,
                openModal,
                closeModal,
                increment,
                decrement,
                removeItem,
                clearCart,
                filterProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };