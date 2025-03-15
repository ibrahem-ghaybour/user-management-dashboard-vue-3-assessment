import { ref } from 'vue';
import type { Ref } from 'vue';
import { useNuxtApp } from '#app';
import type { User, UserFilters, PaginatedResponse } from '~/types/user';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}

export function useDashboardStats() {
  const { $api } = useNuxtApp();
  const stats: Ref<DashboardStats> = ref({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch dashboard statistics
  async function fetchStats() {
    isLoading.value = true;
    error.value = null;

    try {
      // Fetch total users count
      const totalUsersResponse = await $api.get<PaginatedResponse<User>>('users', { pageSize: '1' });
      stats.value.totalUsers = totalUsersResponse.pagination.totalItems;

      // Fetch active users count
      const activeUsersResponse = await $api.get<PaginatedResponse<User>>('users', { 
        pageSize: '1',
        status: 'active'
      });
      stats.value.activeUsers = activeUsersResponse.pagination.totalItems;

      // Fetch admin users count
      const adminUsersResponse = await $api.get<PaginatedResponse<User>>('users', { 
        pageSize: '1',
        role: 'admin'
      });
      stats.value.adminUsers = adminUsersResponse.pagination.totalItems;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch dashboard statistics';
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    stats,
    isLoading,
    error,
    fetchStats
  };
} 