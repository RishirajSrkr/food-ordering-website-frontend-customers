import axios from "axios";

export const addItemToCart = async (foodId, token) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/carts`, { foodId }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const removeItemFromCart = async (foodId, token) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/carts/remove`, { foodId }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getCartData = async (token) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/carts`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data.items;
}