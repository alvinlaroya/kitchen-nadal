import { type ApiResponse, api, handleAxiosError } from "./client";

export type Tag = string;
export type Tags = Tag[];

export const fetchTags = async (): Promise<ApiResponse<Tags>> => {
    try {
        const response = await api.get<Tags>(`/tags`);
        return { data: response.data };
    } catch (error) {
        return {
            data: [],
            error: handleAxiosError(error)
        };
    }
};
