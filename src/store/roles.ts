import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Ref } from "vue";
import type { Role } from "~/types/role";

// Predefined roles with permissions for demo purposes
const DEMO_ROLES: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all features",
    permissions: [
      "users:read",
      "users:write",
      "users:delete",
      // "roles:read",
      // "roles:write",
      // "roles:delete",
      "settings:read",
      "settings:write",
    ],
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Can manage users but not roles",
    permissions: ["users:read", "users:write", "settings:read"],
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user",
    name: "Regular User",
    description: "Basic access to the system",
    permissions: ["users:read", "settings:read"],
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "guest",
    name: "Guest",
    description: "Limited read-only access",
    permissions: ["users:read"],
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export const useRolesStore = defineStore("roles", () => {
  // State
  const roles: Ref<Role[]> = ref([...DEMO_ROLES]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentUserRole = ref<string | null>(null);

  // Computed properties
  const roleMap = computed(() => {
    const map = new Map<string, Role>();
    roles.value.forEach((role) => {
      map.set(role.id, role);
    });
    return map;
  });

  // Actions
  async function fetchRoles() {
    isLoading.value = true;
    error.value = null;

    try {
      // For demo purposes, we'll use the predefined roles
      // In a real app, this would make an API call to fetch roles
      roles.value = [...DEMO_ROLES];
      return roles.value;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch roles";
      console.error("Error fetching roles:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Get role name by ID
  function getRoleName(roleId: string): string {
    const role = roleMap.value.get(roleId);
    return role ? role.name : roleId;
  }

  // Check if a role has a specific permission
  function hasPermission(roleId: string, permission: string): boolean {
    const role = roleMap.value.get(roleId);
    return role ? role.permissions.includes(permission) : false;
  }

  // Check if current user has a specific permission
  function currentUserHasPermission(permission: string): boolean {
    if (!currentUserRole.value) return false;
    return hasPermission(currentUserRole.value, permission);
  }

  // Set current user role
  function setCurrentUserRole(roleId: string | null) {
    currentUserRole.value = roleId;
  }

  return {
    // State
    roles,
    isLoading,
    error,
    currentUserRole,

    // Computed
    roleMap,

    // Actions
    fetchRoles,
    getRoleName,
    hasPermission,
    currentUserHasPermission,
    setCurrentUserRole,
  };
});
