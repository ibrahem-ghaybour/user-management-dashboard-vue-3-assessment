import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  User,
  PaginatedResponse,
  UserFilters,
  SortDirection,
  CreateUserRequest,
  UpdateUserRequest,
} from "~/types/user";
import type { Ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  // State
  const users: Ref<User[]> = ref([]);
  const currentUser: Ref<User | null> = ref(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const filters = ref<UserFilters>({});
  const sortBy = ref<string | undefined>(undefined);
  const sortDirection = ref<SortDirection>("asc");

  // Computed properties
  const totalUsers = computed(() => pagination.value.totalItems);
  const currentPage = computed(() => pagination.value.page);
  const totalPages = computed(() => pagination.value.totalPages);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);

  // Actions
  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {
        page: pagination.value.page.toString(),
        pageSize: pagination.value.pageSize.toString(),
      };

      // Add filters
      if (filters.value.search) queryParams.search = filters.value.search;
      if (filters.value.role) queryParams.role = filters.value.role;
      if (filters.value.status) queryParams.status = filters.value.status;
      if (filters.value.department)
        queryParams.department = filters.value.department;

      // Add sorting
      if (sortBy.value) queryParams.sortBy = sortBy.value;
      if (sortDirection.value) queryParams.sortDirection = sortDirection.value;

      // Use $fetch for SSR compatibility
      const result = await $fetch<PaginatedResponse<User>>("/api/users", {
        method: "GET",
        params: queryParams,
      });

      // Update state with optimistic UI update
      users.value = result.data;
      pagination.value = result.pagination;

      return result;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch users";
      console.error("Error fetching users:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const user = await $fetch<User>(`/api/users/${id}`, {
        method: "GET",
      });

      currentUser.value = user;
      return user;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch user";
      console.error("Error fetching user:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser(userData: CreateUserRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      const newUser = await $fetch<User>("/api/users", {
        method: "POST",
        body: userData,
      });
      // Optimistic update - add to users array if on first page
      if (pagination.value.page === 1) {
        users.value = [newUser, ...users.value].slice(
          0,
          pagination.value.pageSize
        );
      }

      // Update total count
      pagination.value.totalItems++;
      pagination.value.totalPages = Math.ceil(
        pagination.value.totalItems / pagination.value.pageSize
      );

      currentUser.value = newUser;
      return newUser;
    } catch (err: any) {
      error.value = err.message || "Failed to create user";
      console.error("Error creating user:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(id: string, userData: UpdateUserRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      // Optimistic update



      // @Here is a problem that can be solved like this:=>


      // async function updateUser(id: string, userData: UpdateUserRequest) {
      //   isLoading.value = true;
      //   error.value = null;

      //   // Find the user index and store a copy of the original user for a potential rollback.
      //   const userIndex = users.value.findIndex((u) => u.id === id);
      //   let originalUser: User | null = null;

      //   if (userIndex !== -1) {
      //     originalUser = { ...users.value[userIndex] };
      //     const optimisticUser = { ...originalUser, ...userData };
      //     users.value[userIndex] = optimisticUser as User;

      //     if (currentUser.value?.id === id) {
      //       currentUser.value = optimisticUser as User;
      //     }
      //   }
      const userIndex = users.value.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        const updatedUser = { ...users.value[userIndex], ...userData };
        users.value[userIndex] = updatedUser as User;

        if (currentUser.value?.id === id) {
          currentUser.value = updatedUser as User;
        }
      }

      const updatedUser = await $fetch<User>(`/api/users/${id}`, {
        method: "PUT",
        body: userData,
      });

      // Update with actual server response
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser;
      }

      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser;
      }

      return updatedUser;
    } catch (err: any) {
      error.value = err.message || "Failed to update user";
      console.error("Error updating user:", err);

      // Revert optimistic update on error
      fetchUsers();
      if (currentUser.value?.id === id) {
        fetchUser(id);
      }

      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      // Optimistic update - remove from list
      const userIndex = users.value.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        users.value.splice(userIndex, 1);
      }

      // Clear current user if it's the one being deleted
      if (currentUser.value?.id === id) {
        currentUser.value = null;
      }

      // Update pagination
      pagination.value.totalItems--;
      pagination.value.totalPages = Math.ceil(
        pagination.value.totalItems / pagination.value.pageSize
      );

      const result = await $fetch<{ success: boolean; message: string }>(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      return result;
    } catch (err: any) {
      error.value = err.message || "Failed to delete user";
      console.error("Error deleting user:", err);

      // Revert optimistic update on error
      fetchUsers();

      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Pagination methods
  async function goToPage(page: number) {
    pagination.value.page = page;
    await fetchUsers();
  }

  async function nextPage() {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1);
    }
  }

  async function previousPage() {
    if (hasPreviousPage.value) {
      await goToPage(currentPage.value - 1);
    }
  }

  // Filter and sort methods
  async function applyFilters(newFilters: UserFilters) {
    filters.value = { ...newFilters };
    pagination.value.page = 1;
    await fetchUsers();
  }

  async function applySorting(field: string, direction: SortDirection = "asc") {
    sortBy.value = field;
    sortDirection.value = direction;
    await fetchUsers();
  }

  async function resetFilters() {
    filters.value = {};
    sortBy.value = undefined;
    sortDirection.value = "asc";
    pagination.value.page = 1;
    await fetchUsers();
  }

  return {
    // State
    users,
    currentUser,
    isLoading,
    error,
    pagination,
    filters,
    sortBy,
    sortDirection,

    // Computed
    totalUsers,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    goToPage,
    nextPage,
    previousPage,
    applyFilters,
    applySorting,
    resetFilters,
  };
});
