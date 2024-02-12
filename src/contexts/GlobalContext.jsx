import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCookieContext } from "./CookieContext";

const Context = createContext();
export default Context;

export const GlobalContext = ({ children }) => {
    const { cookies } = useCookieContext();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const getCategoriesAndProducts = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products", {
                headers: {
                    "Authorization": `Bearer ${cookies.accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const { product } = data;
                const cat = ["All", ...new Set(product.map(p => p.category))];
                setCategories(cat);
                setProducts(product);
                setFilteredProducts(product);
            } else {
                console.error(`Error fetching categories and products: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching categories and products:", error);
        }
    }, [cookies.accessToken]);

    const getOrders = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                headers: {
                    "Authorization": `Bearer ${cookies.accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orderItems);
            } else {
                console.error(`Error fetching orders: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [cookies.accessToken]);

    useEffect(() => {
        getCategoriesAndProducts();
        getOrders();
    }, [getCategoriesAndProducts, getOrders]);

    const isTokenExpired = useCallback((token) => {
        if (!token) {
            return true;
        }
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        const expirationTime = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        return expirationTime < currentTime;
    }, []);

    const addProductToOrder = useCallback((p) => {
        const order = {
            ...p,
            quantity: 1
        }

        console.log(order)
        setOrders(prevOrders => {
            const productExists = prevOrders.find(product => product.id === p.id);
            if (!productExists) {
                return [...prevOrders, order];
            }
            return prevOrders;
        });
    }, []);

    function filterProducts(category) {
        if (category === "All")
            setFilteredProducts([...products])
        else {
            var filtered = products.filter((p) => p.category === category);
            console.log([...filtered])
            setFilteredProducts(filtered);
        }
    }

    const contextData = {
        categories,
        currentCategory,
        products,
        filteredProducts,
        orders,
        navigate,
        setCurrentCategory,
        filterProducts,
        getProducts: getCategoriesAndProducts,
        setProducts,
        getOrders,
        isTokenExpired,
        addProductToOrder
    };

    return <Context.Provider value={contextData}>{children}</Context.Provider>;
};