import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRolesStore } from '~/store/roles';
import type { Role } from '~/types/user';

// Mock roles data
const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['users:read', 'users:write', 'users:delete']
  },
  {
    id: 'user',
    name: 'Regular User',
    permissions: ['users:read']
  }
];

// Mock $fetch
vi.mock('#app', async () => {
  const actual = await vi.importActual('#app');
  return {
    ...actual as any,
    $fetch: vi.fn()
  };
});

// Create a proper $fetch mock type
declare global {
  // eslint-disable-next-line no-var
  var $fetch: any;
}

describe('useRolesStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    
    // Reset mocks
    vi.resetAllMocks();
    
    // Mock $fetch to return roles
    global.$fetch = vi.fn().mockResolvedValue(mockRoles);
  });

  it('should initialize with empty roles array', () => {
    const store = useRolesStore();
    expect(store.roles).toEqual([]);
  });

  it('should fetch roles and update state', async () => {
    const store = useRolesStore();
    
    await store.fetchRoles();
    
    expect(global.$fetch).toHaveBeenCalledWith('/api/roles');
    expect(store.roles).toEqual(mockRoles);
  });

  it('should handle fetch error', async () => {
    const store = useRolesStore();
    
    const errorMessage = 'Failed to fetch roles';
    global.$fetch = vi.fn().mockRejectedValue(new Error(errorMessage));
    
    await expect(store.fetchRoles()).rejects.toThrow();
    expect(store.error).toBe(errorMessage);
  });

  it('should get role name by ID', async () => {
    const store = useRolesStore();
    
    // First fetch roles
    await store.fetchRoles();
    
    expect(store.getRoleName('admin')).toBe('Administrator');
    expect(store.getRoleName('user')).toBe('Regular User');
    expect(store.getRoleName('unknown')).toBe('unknown');
  });

  it('should check if role has permission', async () => {
    const store = useRolesStore();
    
    // First fetch roles
    await store.fetchRoles();
    
    expect(store.hasPermission('admin', 'users:write')).toBe(true);
    expect(store.hasPermission('user', 'users:write')).toBe(false);
    expect(store.hasPermission('unknown', 'users:read')).toBe(false);
  });

  it('should set and check current user role', async () => {
    const store = useRolesStore();
    
    // First fetch roles
    await store.fetchRoles();
    
    // Set current user role
    store.setCurrentUserRole('admin');
    
    expect(store.currentUserRole).toBe('admin');
    expect(store.currentUserHasPermission('users:write')).toBe(true);
    expect(store.currentUserHasPermission('users:delete')).toBe(true);
    
    // Change role
    store.setCurrentUserRole('user');
    
    expect(store.currentUserRole).toBe('user');
    expect(store.currentUserHasPermission('users:write')).toBe(false);
    expect(store.currentUserHasPermission('users:read')).toBe(true);
  });
}); 