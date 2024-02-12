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
    const [isContextMount, setIsContextMount] = useState(false)

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

    const getProductById = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                const { product } = data;
                return product;
            }
            else {
                console.log(response.status)
                console.log(response.json())
            }
        } catch (error) {
            console.log(error)
        }

    }

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

    async function sendOrders() {
        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                method: "PUT",
                body: JSON.stringify({ orderItems: orders }),
                headers:
                {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${cookies.accessToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
            else {
                console.log(response.status)
                console.log(response.json())
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategoriesAndProducts();
        getOrders();
    }, []);

    useEffect(() => {
        if (isContextMount) {
            sendOrders();
        }
        else {
            setIsContextMount(true);
        }
    }, [orders])

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

    function addProductToOrder(p) {
        setOrders(prev => [...prev, p])
    };

    function filterProducts(category) {
        if (category === "All")
            setFilteredProducts([...products])
        else {
            var filtered = products.filter((p) => p.category === category);
            console.log([...filtered])
            setFilteredProducts(filtered);
        }
    };

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
        setOrders,
        getOrders,
        isTokenExpired,
        addProductToOrder,
        getProductById
    };

    return <Context.Provider value={contextData}>{children}</Context.Provider>;
};