<template>
  <div class="pb-5" v-if="isAuthenticated">
    <div class="page-header">
      <h2>{{ $t("users.title") }}</h2>
      <button
        class="btn btn-primary"
        @click="createNewUser"
        v-role="'users:write'"
      >
        {{ $t("users.newUser") }}
      </button>
    </div>

    <div v-if="usersStore.error" class="error-message">
      {{ usersStore.error }}
    </div>

    <div class="search-filter-container">
      <SearchBar @search="handleSearch" />
      <FilterControls @filter="handleFilter" />
    </div>

    <div v-if="usersStore.isLoading" class="loading-indicator h-[80dvh]">
      <UiLoading />
    </div>

    <UserTable
      v-else
      :users="usersStore.users"
      :total-items="usersStore.totalUsers"
      :current-page="usersStore.currentPage"
      :total-pages="usersStore.totalPages"
      @page-change="handlePageChange"
      @sort="handleSort"
      @delete="handleDeleteUser"
    />

    <div class="pagination" v-if="usersStore.totalPages > 1">
      <button
        class="btn btn-secondary"
        :disabled="!usersStore.hasPreviousPage"
        @click="usersStore.previousPage()"
      >
        {{ $t("common.back") }}
      </button>
      <span>{{
        $t("pagination.showing", {
          from: (usersStore.currentPage - 1) * 10 + 1,
          to: Math.min(usersStore.currentPage * 10, usersStore.totalUsers),
          total: usersStore.totalUsers,
        })
      }}</span>
      <button
        class="btn btn-secondary"
        :disabled="!usersStore.hasNextPage"
        @click="usersStore.nextPage()"
      >
        {{ $t("common.next") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/store/users";
import { useRolesStore } from "~/store/roles";
import SearchBar from "~/components/users/SearchBar.vue";
import FilterControls from "~/components/users/FilterControls.vue";
import UserTable from "~/components/users/UserTable.vue";
import type { UserFilters } from "~/types/user";
import { useAuthStore } from "~/store/auth";
const { isAuthenticated } = useAuthStore();
const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { $i18n } = useNuxtApp();
const isDeleting = ref(false);

// Load initial data
onMounted(async () => {
  try {
    // Load roles first (needed for role names in the table)
    if (rolesStore.roles.length === 0) {
      await rolesStore.fetchRoles();
    }

    // Then load users
    await usersStore.fetchUsers();
  } catch (error) {
    console.error("Failed to load initial data:", error);
  }
});

// Handle search
function handleSearch(searchTerm: string) {
  usersStore.applyFilters({ search: searchTerm });
}

// Handle filters
function handleFilter(filters: UserFilters) {
  usersStore.applyFilters(filters);
}

// Handle pagination
function handlePageChange(page: number) {
  usersStore.goToPage(page);
}

// Handle sorting
function handleSort(field: string, direction: "asc" | "desc") {
  usersStore.applySorting(field, direction);
}

// Handle user deletion
async function handleDeleteUser(userId: string) {
  if (isDeleting.value) return;

  try {
    isDeleting.value = true;
    await usersStore.deleteUser(userId);
    // Refresh the user list after deletion
    await usersStore.fetchUsers();
    alert($i18n.t("users.userDeleted"));
  } catch (error) {
    console.error("Failed to delete user:", error);
    alert($i18n.t("users.errorDeleting"));
  } finally {
    isDeleting.value = false;
  }
}

// Create new user
function createNewUser() {
  router.push("/users/new");
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: var(--text-color);
  border: none;
}

.btn-secondary:hover {
  background-color: var(--dark-gray);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.error-message {
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color);
}
</style>
