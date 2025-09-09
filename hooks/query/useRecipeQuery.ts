import {
    useQuery
} from '@tanstack/react-query';

// api functions
import { fetchRecipeById, fetchRecipes } from '@/utils/api/recipes';

export const useRecipeQuery = () => {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    })
}

export const useRecipeByIdQuery = (id: number | undefined) => {
    return useQuery({
        queryKey: ['details', id],
        queryFn: () => fetchRecipeById(id as number),
        enabled: !!id, // Only run the query if id is defined
    })
}