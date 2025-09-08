import { QueryOptions } from "@tanstack/react-query";
import { type ApiResponse, api, handleAxiosError } from "../api/client";

export interface Recipe {
    id: number;
    name: string;
    image: string;
    cookTimeMinutes: number;
    ingredients: string[];
    instructions: string[];
}

export interface Recipes {
    limit: number;
    recipes: Recipe[];
}

export const createRecipeQueryOptions = (): QueryOptions<ApiResponse<Recipes>> => {
    return {
        queryKey: ['recipes'],  // Unique key for the query
        queryFn: fetchRecipes, // Function to fetch the data
    };
}

export const fetchRecipes = async (): Promise<ApiResponse<Recipes>> => {
    try {
        const response = await api.get<Recipes>('');
        return { data: response.data };
    } catch (error) {
        return {
            data: { limit: 0, recipes: [] },
            error: handleAxiosError(error)
        };
    }
};

export const fetchRecipeById = async (id: number): Promise<ApiResponse<Recipe>> => {
    try {
        const response = await api.get<Recipe>(`/${id}`);
        return { data: response.data };
    } catch (error) {
        return {
            data: {} as Recipe,
            error: handleAxiosError(error)
        };
    }
};