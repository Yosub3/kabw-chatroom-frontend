'use server'

import api from "@/api";
import { handleApiError } from "@/utils/handleApiError";

export const getMessages = async ({
    page = 1, 
    limit = 10, 
    search = "", 
    headers
}: {
    page?: number, 
    limit?: number, 
    search?: string, 
    headers: any
}) => {
    const params = new URLSearchParams({page: String(page), limit: String(limit), search: search});
    if(search) params.append("search", search);

    try {
        const res = await api.get(`/message?${params.toString()}`, {headers: headers});
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed getting messages");
    }
}

export const createMessage = async (message: string, headers: any) => {
    try {
        const res = await api.post('/message', {message: message}, {headers: headers});
        return res.data
    } catch (error) {
        handleApiError(error, "Failed creating message");
    }
}