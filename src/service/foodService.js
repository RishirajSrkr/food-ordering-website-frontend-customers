import axios from "axios";


export const fetchFoodList = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/foods`);
        return response.data;
    }
    catch (e) {
        console.log("Error fetching food list", error);
        throw e;
    }

}