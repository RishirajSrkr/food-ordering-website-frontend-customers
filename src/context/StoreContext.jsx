import { createContext, useContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import { getTokenFromLocalStorage } from "../service/authService";
import { addItemToCart, getCartData, removeItemFromCart } from "../service/cartService";

const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {


    const [foodList, setFoodList] = useState([])
    const [quantities, setQuantities] = useState({
        // foodId: qty,
        // foodId: qty,
    })
    const [token, setToken] = useState("");

    const incrementQty = async (foodId) => {
        setQuantities((prev) => ({ ...prev, [foodId]: prev[foodId] ? prev[foodId] + 1 : 1 }));
        await addItemToCart(foodId, token);
    }
    const decrementQty = async (foodId) => {
        setQuantities((prev) => ({ ...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
        await removeItemFromCart(foodId, token);
    }

    const removeFromCart = (foodId) => {
        setQuantities((prev) => ({ ...prev, [foodId]: 0 }))
    }

    const loadCartData = async (token) => {
        const items = await getCartData(token);
         setQuantities(items)
    }



    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data)
            if (getTokenFromLocalStorage()) {
                setToken(getTokenFromLocalStorage());
                await loadCartData(getTokenFromLocalStorage())
            }
        }
        loadData();
    }, [])



    const contextValue = {
        foodList,
        quantities,
        setQuantities,
        incrementQty,
        decrementQty,
        removeFromCart,
        token,
        setToken,
        loadCartData,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )


}


export const useStoreContext = () => useContext(StoreContext);