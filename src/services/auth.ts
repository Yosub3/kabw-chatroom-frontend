'use client'

import api from "@/api";
import { LoginData, RegisterData } from "@/interfaces/IAuth";
import { handleApiError } from "@/utils/handleApiError";

export const login = async (userDataLogin: LoginData) => {
    try{
        const response = await api.post("/auth/login", userDataLogin);
        return response.data;
    } catch(error){
        handleApiError(error, "Login failed");
    }
}

export const register = async (userDataRegister: RegisterData) => {
    try{
        const response = await api.post("/auth/register", userDataRegister);
        return response.data;
    } catch(error){
        handleApiError(error, "Register failed");
    }
}

// export const profile = async (token: string) => {
//     try{
//         const response = await api.get("/auth/profile", {headers: {Authorization: `Bearer ${token}`}});
//         return response.data;
//     } catch(error){
//         handleApiError(error, "Failed getting profile");
//     }
// }

export const logout = () => {
    localStorage.removeItem("token");
}

export const checkAuth = () => {
    const token = localStorage.getItem("token");
    return (token) ? true : false;
}