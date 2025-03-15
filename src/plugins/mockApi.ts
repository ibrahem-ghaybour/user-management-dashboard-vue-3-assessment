import { defineNuxtPlugin } from '#app';

// Client-side mock API configuration
const defaultConfig = {
  failureProbability: 0.05
};

let currentConfig = { ...defaultConfig };

// Define the API type
interface ApiPlugin {
  get: <T>(endpoint: string, queryParams?: Record<string, string>) => Promise<T>;
  post: <T>(endpoint: string, data?: any) => Promise<T>;
  put: <T>(endpoint: string, data: any) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

export default defineNuxtPlugin((nuxtApp) => {
  // Type assertion for the API plugin
  const $api = nuxtApp.$api as ApiPlugin;

  // Make the mock API available globally
  return {
    provide: {
      mockApi: {
        // Get the current configuration
        getConfig() {
          return { ...currentConfig };
        },
        
        // Update the configuration
        updateConfig(newConfig: Partial<typeof defaultConfig>) {
          currentConfig = { ...currentConfig, ...newConfig };
          
          // Send the updated config to the server
          $api.post('mock-config', currentConfig).catch((err: Error) => {
            console.error('Failed to update mock API config on server:', err);
          });
        },
        
        // Reset the mock data
        resetMockData() {
          $api.post('mock-reset').catch((err: Error) => {
            console.error('Failed to reset mock data:', err);
          });
        },
        
        // Add a method to simulate a failure for testing error handling
        simulateFailure(probability = 1) {
          const originalProbability = currentConfig.failureProbability;
          this.updateConfig({ failureProbability: probability });
          
          // Reset the failure probability after a short delay
          setTimeout(() => {
            this.updateConfig({ failureProbability: originalProbability });
          }, 5000);
        }
      }
    }
  };
}); 