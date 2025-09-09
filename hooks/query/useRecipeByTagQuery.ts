import {
    useQuery
} from '@tanstack/react-query';

// api functions
import { fetchRecipeByTag } from '@/utils/api/recipes';

export const useRecipeByTagQuery = (tag: string) => {
    return useQuery({
        queryKey: ['recipesByTag', tag],
        queryFn: () => fetchRecipeByTag(tag),
        enabled: !!tag, // Only run the query if id is defined
    })
}