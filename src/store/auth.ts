import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useRolesStore } from './roles';
import type { User } from '~/types/user';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Storage keys
const STORAGE_KEYS = {
  USER: 'user_management_user',
  LAST_ACTIVITY: 'user_management_last_activity',
  AUTH_TOKEN: 'user_management_token'
};

// Hard-coded users for demo purposes
const DEMO_USERS: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    department: 'IT',
    location: 'Headquarters',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-06-15T08:30:00Z'
  },
  {
    id: '2',
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@example.com',
    role: 'manager',
    status: 'active',
    department: 'Sales',
    location: 'East Office',
    createdAt: '2023-02-15T00:00:00Z',
    lastLogin: '2023-06-14T10:45:00Z'
  },
  {
    id: '3',
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    department: 'Marketing',
    location: 'West Office',
    createdAt: '2023-03-20T00:00:00Z',
    lastLogin: '2023-06-13T14:20:00Z'
  },
  {
    id: '4',
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com',
    role: 'guest',
    status: 'active',
    department: 'External',
    location: 'Remote',
    createdAt: '2023-04-10T00:00:00Z',
    lastLogin: '2023-06-12T09:15:00Z'
  }
];

// Hard-coded passwords for demo purposes (in a real app, never store passwords in plain text)`
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'user@example.com': 'user123',
  'guest@example.com': 'guest123'
};

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser: Ref<User | null> = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastActivity = ref<number>(Date.now());
  const sessionTimeoutId = ref<NodeJS.Timeout | null>(null);

  // For demo purposes, we'll simulate authentication with mock data
  // In a real app, this would connect to an auth API
  
  // Computed properties
  const userFullName = computed(() => {
    if (!currentUser.value) return '';
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
  });
  
  const userRole = computed(() => currentUser.value?.role || null);
  
  const isSessionExpired = computed(() => {
    if (!isAuthenticated.value) return false;
    return Date.now() - lastActivity.value > SESSION_TIMEOUT;
  });

  // Initialize from session storage
  function initFromStorage() {
    if (import.meta.server) return;
    
    try {
      // Get stored user data
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedLastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      
      if (storedUser && storedLastActivity) {
        const user = JSON.parse(storedUser) as User;
        const lastActivityTime = parseInt(storedLastActivity, 10);
        
        // Check if session is still valid
        if (Date.now() - lastActivityTime <= SESSION_TIMEOUT) {
          // Restore session
          currentUser.value = user;
          isAuthenticated.value = true;
          lastActivity.value = lastActivityTime;
          
          // Set the user's role in the roles store
          const rolesStore = useRolesStore();
          rolesStore.setCurrentUserRole(user.role);
          
          // Start session timeout monitoring
          startSessionTimeoutMonitoring();
          
          // Update last activity
          updateLastActivity();
        } else {
          // Session expired, clear storage
          clearStorage();
        }
      }
    } catch (err) {
      console.error('Error restoring session from storage:', err);
      clearStorage();
    }
  }

  // Save session to storage
  function saveToStorage() {
    if (import.meta.server) return;
    
    if (currentUser.value && isAuthenticated.value) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser.value));
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, lastActivity.value.toString());
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token');
    } else {
      clearStorage();
    }
  }

  // Clear storage
  function clearStorage() {
    if (import.meta.server) return;
    
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      // Find user by email
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Check if user exists and password matches
      if (!user || DEMO_PASSWORDS[user.email] !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Update user's last login
      const authenticatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      currentUser.value = authenticatedUser;
      isAuthenticated.value = true;
      lastActivity.value = Date.now();
      
      // Set the user's role in the roles store
      const rolesStore = useRolesStore();
      rolesStore.setCurrentUserRole(authenticatedUser.role);
      
      // Start session timeout monitoring
      startSessionTimeoutMonitoring();
      
      // Save to storage
      saveToStorage();
      
      return { user: authenticatedUser, token: 'demo-token' };
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      console.error('Error during login:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    
    // Clear session timeout
    if (sessionTimeoutId.value) {
      clearInterval(sessionTimeoutId.value);
      sessionTimeoutId.value = null;
    }
    
    // Clear the user's role in the roles store
    const rolesStore = useRolesStore();
    rolesStore.setCurrentUserRole(null);
    
    // Clear storage
    clearStorage();
    
    // In a real app, you might also want to invalidate the token on the server
  }

  function updateLastActivity() {
    lastActivity.value = Date.now();
    
    // Update storage with new last activity time
    if (isAuthenticated.value) {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, lastActivity.value.toString());
    }
  }

  function startSessionTimeoutMonitoring() {
    // Clear any existing timeout
    if (sessionTimeoutId.value) {
      clearInterval(sessionTimeoutId.value);
    }
    
    // Check for session expiration every minute
    // sessionTimeoutId.value = setInterval(() => {
    //   if (isSessionExpired.value) {
    //     logout();
    //     // You might want to redirect to login page or show a notification
    //     window.location.href = '/login?expired=true';
    //   }
    // }, 60 * 1000); // Check every minute
  }

  // Check if user has permission for an action
  function hasPermission(permission: string): boolean {
    if (!isAuthenticated.value || !currentUser.value) return false;
    
    const rolesStore = useRolesStore();
    return rolesStore.hasPermission(currentUser.value.role, permission);
  }

  // Initialize from storage when the store is created
  if (process.client) {
    initFromStorage();
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    lastActivity,
    
    // Computed
    userFullName,
    userRole,
    isSessionExpired,
    
    // Actions
    login,
    logout,
    updateLastActivity,
    hasPermission,
    initFromStorage
  };
}); 