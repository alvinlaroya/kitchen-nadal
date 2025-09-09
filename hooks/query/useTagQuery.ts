import {
    useQuery
} from '@tanstack/react-query';

// api functions
import { fetchTags } from '@/utils/api/tags';

export const useTagQuery = () => {
    return useQuery({ queryKey: ['tags'], queryFn: fetchTags })
}