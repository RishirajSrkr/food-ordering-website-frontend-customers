import axios from "axios";

export const registerUser = async (formData) => {

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData);
        return response;
    }
    catch (error) {
        throw error.response.data.message || "Registration failed";
    }
}


export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
        return response;
    }
    catch (error) {
        throw error.response.data.message || "Login failed";
    }
}


export const setTokenInLocalStorage = (response) => {
    localStorage.setItem("token", response.data.token);
}

export const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token");
}