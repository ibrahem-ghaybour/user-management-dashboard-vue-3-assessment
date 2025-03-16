<template>
  <div class="pb-5" v-if="isAuthenticated">
    <div class="flex justify-between items-center mb-8">
      <h2>{{ $t("users.title") }}</h2>
      <button
        class="btn btn-primary"
        @click="createNewUser"
        v-role="'users:write'"
      >
        {{ $t("users.newUser") }}
      </button>
    </div>

    <div v-if="usersStore.error" class="bg-red-500 text-white p-3 rounded mb-4">
      {{ usersStore.error }}
    </div>

    <div class="flex flex-wrap gap-4 mb-6">
      <SearchBar @search="handleSearch" />
      <FilterControls @filter="handleFilter" />
    </div>

    <div v-if="usersStore.isLoading" class="flex items-center justify-center h-[80vh]">
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

    <div class="pagination flex flex-col items-center mt-6 space-y-4" v-if="usersStore.totalPages > 1">
      <div class="flex space-x-2">
        <button
          v-for="page in usersStore.totalPages"
          :key="page"
          class="btn btn-secondary"
          :class="{ 'bg-blue-500 text-white': page === usersStore.currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>
      <div class="flex items-center space-x-4">
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
.btn {
  @apply inline-block px-4 py-2 rounded text-center font-medium cursor-pointer;
}

.btn-primary {
  @apply bg-blue-500 text-white border-none;
}

.btn-primary:hover {
  @apply bg-blue-600;
}

.btn-secondary {
  @apply bg-gray-300 text-gray-700 border-none;
}

.btn-secondary:hover {
  @apply bg-gray-400 text-white;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
