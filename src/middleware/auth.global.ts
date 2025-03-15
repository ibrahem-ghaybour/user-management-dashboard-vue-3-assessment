import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware if running on server (SSR)
  if (import.meta.server) return;

  const authStore = useAuthStore();
   authStore.initFromStorage();
  // Skip middleware for login page
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
    return;
  }

  // Update last activity timestamp
  authStore.updateLastActivity();
  console.log("lorem tahvc");
  // Check if the route requires specific permissions
  if (
    to.meta.requiredPermissions &&
    Array.isArray(to.meta.requiredPermissions)
  ) {
    const requiredPermissions = to.meta.requiredPermissions as string[];

    // Check if the user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      authStore.hasPermission(permission)
    );

    if (!hasAllPermissions) {
      // Redirect to unauthorized page or dashboard
      return navigateTo("/unauthorized");
    }
  }
});
