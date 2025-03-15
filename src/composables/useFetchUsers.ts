import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useNuxtApp } from '#app';
import type { User, PaginatedResponse, UserFilters, SortDirection } from '~/types/user';

export function useFetchUsers() {
  const { $api } = useNuxtApp();
  const users: Ref<User[]> = ref([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const filters = ref<UserFilters>({});
  const sortBy = ref<string | undefined>(undefined);
  const sortDirection = ref<SortDirection>('asc');

  // Computed properties
  const totalUsers = computed(() => pagination.value.totalItems);
  const currentPage = computed(() => pagination.value.page);
  const totalPages = computed(() => pagination.value.totalPages);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);

  // Fetch users with current pagination, filters, and sorting
  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {
        page: pagination.value.page.toString(),
        pageSize: pagination.value.pageSize.toString()
      };
      
      // Add filters
      if (filters.value.search) queryParams.search = filters.value.search;
      if (filters.value.role) queryParams.role = filters.value.role;
      if (filters.value.status) queryParams.status = filters.value.status;
      if (filters.value.department) queryParams.department = filters.value.department;
      if (filters.value.location) queryParams.location = filters.value.location;
      if (filters.value.createdFrom) queryParams.createdFrom = filters.value.createdFrom;
      if (filters.value.createdTo) queryParams.createdTo = filters.value.createdTo;
      
      // Add sorting
      if (sortBy.value) queryParams.sortBy = sortBy.value;
      if (sortDirection.value) queryParams.sortDirection = sortDirection.value;
      
      // Make API request using the API plugin
      const result = await $api.get<PaginatedResponse<User>>('users', queryParams);
      
      // Update state
      users.value = result.data;
      pagination.value = result.pagination;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users';
      console.error('Error fetching users:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Set page and fetch users
  async function goToPage(page: number) {
    pagination.value.page = page;
    await fetchUsers();
  }

  // Go to next page
  async function nextPage() {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1);
    }
  }

  // Go to previous page
  async function previousPage() {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1);
    }
  }

  // Update filters and reset to page 1
  async function applyFilters(newFilters: UserFilters) {
    filters.value = { ...newFilters };
    pagination.value.page = 1;
    await fetchUsers();
  }

  // Update sorting and fetch users
  async function applySorting(field: string, direction: SortDirection = 'asc') {
    sortBy.value = field;
    sortDirection.value = direction;
    await fetchUsers();
  }

  // Reset all filters and sorting
  async function resetFilters() {
    filters.value = {};
    sortBy.value = undefined;
    sortDirection.value = 'asc';
    pagination.value.page = 1;
    await fetchUsers();
  }

  return {
    users,
    isLoading,
    error,
    pagination,
    filters,
    sortBy,
    sortDirection,
    totalUsers,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    fetchUsers,
    goToPage,
    nextPage,
    previousPage,
    applyFilters,
    applySorting,
    resetFilters
  };
}
