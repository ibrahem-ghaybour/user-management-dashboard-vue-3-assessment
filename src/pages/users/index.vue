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

    <div
      v-if="usersStore.isLoading"
      class="flex items-center justify-center h-[80vh]"
    >
      <UiLoading />
    </div>
    <div v-else>
      <UserTable
        :users="usersStore.users"
        :total-items="usersStore.totalUsers"
        :current-page="usersStore.currentPage"
        :total-pages="usersStore.totalPages"
        @page-change="handlePageChange"
        @sort="handleSort"
        @delete="handleDeleteUser"
      />
      <UsersPagination />
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
    // alert($i18n.t("users.userDeleted"));
  } catch (error) {
    console.error("Failed to delete user:", error);
    // alert($i18n.t("users.errorDeleting"));
  } finally {
    isDeleting.value = false;
  }
}

// Create new user
function createNewUser() {
  router.push("/users/new");
}
</script>

<style scoped></style>
