import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookieContext } from "./CookieContext";

const Context = createContext();
export default Context;

export const GlobalContext = ({ children }) => {
    const { cookies } = useCookieContext();
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState("All")
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [orders, setOrders] = useState([])
    const navigate = useNavigate();

    async function getProducts() {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            if (response.ok) {
                const data = await response.json()
                setProducts(data.product)
            }
            else {
                console.log(response.status)
                console.log(response.json())
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getCategories() {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            if (response.ok) {
                const data = await response.json()
                const { product } = data;
                const cat = Array.from(new Set(product.map(p => p.category)));
                setCategories(["All", ...cat])
            }
            else {
                console.log(response.status)
                console.log(response.json())
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function filterProducts(category) {
        if (category === "All")
            setFilteredProducts([...products])
        else {
            var filtered = products.filter((p) => p.category === category);
            console.log([...filtered])
            setFilteredProducts(filtered);
        }
    }

    function addProductToOrder(p) {
        const productExists = orders.find(product => product.id === p.id);
        if (!productExists) {
            setOrders(prev => [...prev, p])
        }
    }

    async function getOrders() {
        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                headers:
                {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${cookies.accessToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orderItems);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const isTokenExpired = (token) => {
        if (!token) {
            return true;
        }

        const [, payloadBase64] = token.split('.');

        const payload = JSON.parse(atob(payloadBase64));

        const expirationTime = payload.exp;

        const currentTime = Math.floor(Date.now() / 1000);
        return expirationTime < currentTime;
    };

    useEffect(() => {
        getOrders()
    }, [])

    const contextData = {
        getCategories: getCategories,
        categories: categories,
        navigate: navigate,
        currentCategory: currentCategory,
        setCurrentCategory: setCurrentCategory,
        filterProducts: filterProducts,
        filteredProducts: filteredProducts,
        products: products,
        getProducts: getProducts,
        orders: orders,
        setOrders: setOrders,
        getOrders: getOrders,
        isTokenExpired: isTokenExpired,
        addProductToOrder: addProductToOrder
    }

    return (
        <Context.Provider value={contextData}>{children}</Context.Provider>
    )
}