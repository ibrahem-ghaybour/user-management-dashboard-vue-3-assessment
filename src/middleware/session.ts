import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware if running on server (SSR)
  if (process.server) return;
  
  const authStore = useAuthStore();
  
  // Check if the session has expired
  if (authStore.isAuthenticated && authStore.isSessionExpired) {
    // Logout the user
    authStore.logout();
    
    // Redirect to login page with a message
    return navigateTo({
      path: '/login',
      query: { 
        expired: 'true'
      }
    });
  }
  
  // Update last activity timestamp for authenticated users
  if (authStore.isAuthenticated) {
    authStore.updateLastActivity();
  }
  
  // Initialize auth store from storage if not already done
  if (!authStore.isAuthenticated && to.path !== '/login') {
    authStore.initFromStorage();
    
    // If still not authenticated after initialization, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo({
        path: '/login',
        query: { 
          redirect: to.fullPath
        }
      });
    }
  }
}); 