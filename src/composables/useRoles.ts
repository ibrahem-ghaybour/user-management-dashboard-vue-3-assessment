import { ref } from 'vue';
import type { Ref } from 'vue';
import { useNuxtApp } from '#app';
import type { Role } from '~/types/user';

export function useRoles() {
  const { $api } = useNuxtApp();
  const roles: Ref<Role[]> = ref([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all available roles
  async function fetchRoles() {
    isLoading.value = true;
    error.value = null;

    try {
      roles.value = await $api.get<Role[]>('roles');
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch roles';
      console.error('Error fetching roles:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Get role name by ID
  function getRoleName(roleId: string): string {
    const role = roles.value.find(r => r.id === roleId);
    return role ? role.name : roleId;
  }

  // Check if a role has a specific permission
  function hasPermission(roleId: string, permission: string): boolean {
    const role = roles.value.find(r => r.id === roleId);
    return role ? role.permissions.includes(permission) : false;
  }

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    getRoleName,
    hasPermission
  };
} 