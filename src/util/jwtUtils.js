//extract the username from the JWT token
import { jwtDecode } from "jwt-decode";

export const extractNameFromToken = (token) => {
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.name || null;
}
