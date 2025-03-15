import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const baseUrl = '/api';

  // Create a reusable fetch function with error handling
  const apiFetch = async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // API methods
  const api = {
    // Generic methods
    get: <T>(endpoint: string, queryParams?: Record<string, string>) => {
      const url = queryParams 
        ? `${endpoint}?${new URLSearchParams(queryParams)}`
        : endpoint;
      return apiFetch<T>(url);
    },
    
    post: <T>(endpoint: string, data?: any) => {
      return apiFetch<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      });
    },
    
    put: <T>(endpoint: string, data: any) => {
      return apiFetch<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    delete: <T>(endpoint: string) => {
      return apiFetch<T>(endpoint, {
        method: 'DELETE'
      });
    }
  };

  return {
    provide: {
      api
    }
  };
});
