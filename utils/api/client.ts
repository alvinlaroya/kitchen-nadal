import env from '@/config/env';
import axios from 'axios';

export interface ApiResponse<T> {
    data: T;
    error?: string;
}

// Create axios instance with default configuration
export const api = axios.create({
    baseURL: env.API_ENDPOINT,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export const handleAxiosError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return `API Error: ${error.response.status} ${error.response.statusText}`;
        } else if (error.request) {
            return 'Network Error: No response received from server';
        }
        return `Error: ${error.message}`;
    }
    return 'An unexpected error occurred';
};