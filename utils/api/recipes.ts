import { type ApiResponse, api, handleAxiosError } from "./client";

export interface Recipe {
    id: number;
    name: string;
    image: string;
    cookTimeMinutes: number;
    prepTimeMinutes?: number;
    servings?: number;
    defficulty?: string;
    cuisine?: string;
    caloriesPerServing?: number;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
    mealType?: string[];
    ingredients?: string[];
    instructions?: string[];
}

export interface Recipes {
    limit: number;
    recipes: Recipe[];
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

export const fetchRecipeByTag = async (tag: string): Promise<ApiResponse<Recipes>> => {
    try {
        const response = await api.get<Recipes>(`/tag/${tag}`); // Assuming the endpoint for searching by name
        return { data: response.data };
    } catch (error) {
        return {
            data: { limit: 0, recipes: [] },
            error: handleAxiosError(error)
        };
    }
};