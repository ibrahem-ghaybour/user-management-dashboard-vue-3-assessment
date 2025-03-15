<template>
  <div>
    <div class="page-header">
      <h2>{{ isNewUser ? $t("users.newUser") : $t("users.editUser") }}</h2>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="goBack">
          {{ $t("common.back") }}
        </button>
        <button
          v-if="!isNewUser"
          class="btn btn-danger"
          @click="confirmDelete"
          v-role:disable="'users:delete'"
        >
          {{ $t("common.delete") }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="isLoading" class="loading-indicator">
      <p>{{ $t("common.loading") }}</p>
    </div>

    <template v-else>
      <UserDetail
        v-if="!isEditing && !isNewUser"
        :user="user"
        @edit="startEditing"
      />
      <UserForm
        v-else
        :user="user"
        :is-new="isNewUser"
        @save="saveUser"
        @cancel="cancelEdit"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "~/store/users";
import { useRolesStore } from "~/store/roles";
import UserDetail from "~/components/users/UserDetail.vue";
import UserForm from "~/components/users/UserForm.vue";
import type { User, CreateUserRequest, UpdateUserRequest } from "~/types/user";

definePageMeta({
  path: '/users/new',
  requiredPermissions: ['users:write']
})
const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { $i18n } = useNuxtApp();

// Get user ID from route params
const userId = computed(() => route.params.id as string);
const isNewUser = computed(() => userId.value === "new");
const isEditing = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Initialize with empty user
const user = ref<User>({
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  status: "active",
  department: "",
  location: "",
  createdAt: new Date().toISOString(),
  lastLogin: undefined,
});

// Check if we should start in edit mode
onMounted(async () => {
  // Load roles if not already loaded
  if (rolesStore.roles.length === 0) {
    await rolesStore.fetchRoles();
  }

  // If this is a new user, start in edit mode
  if (isNewUser.value) {
    isEditing.value = true;
    return;
  }

  // Otherwise, load the user data
  isLoading.value = true;
  error.value = null;

  try {
    const userData = await usersStore.fetchUser(userId.value);
    user.value = userData;

    // Check if we should start in edit mode (from query param)
    if (route.query.edit === "true") {
      isEditing.value = true;
    }
  } catch (err: any) {
    error.value = err.message || $i18n.t("users.errorLoading");
    console.error("Error loading user:", err);
  } finally {
    isLoading.value = false;
  }
});

// Navigation
function goBack() {
  router.push("/users");
}

// Editing
function startEditing() {
  isEditing.value = true;
}

function cancelEdit() {
  if (isNewUser.value) {
    // If creating a new user, go back to list
    goBack();
  } else {
    // If editing existing user, just cancel edit mode
    isEditing.value = false;
  }
}

// Save user
async function saveUser(userData: CreateUserRequest | UpdateUserRequest) {
  isLoading.value = true;
  error.value = null;

  try {
    if (isNewUser.value) {
      // Create new user
      const newUser = await usersStore.createUser(
        userData as CreateUserRequest
      );
      router.push(`/users/${newUser.id}`);
    } else {
      // Update existing user
      await usersStore.updateUser(userId.value, userData as UpdateUserRequest);
      user.value = await usersStore.fetchUser(userId.value);
      isEditing.value = false;
    }
  } catch (err: any) {
    error.value =
      err.message ||
      (isNewUser.value ? t("users.errorCreating") : t("users.errorUpdating"));
    console.error("Error saving user:", err);
  } finally {
    isLoading.value = false;
  }
}

// Delete user
async function confirmDelete() {
  if (confirm(t("users.deleteConfirm"))) {
    isLoading.value = true;
    error.value = null;

    try {
      await usersStore.deleteUser(userId.value);
      router.push("/users");
    } catch (err: any) {
      error.value = err.message || t("users.errorDeleting");
      console.error("Error deleting user:", err);
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: var(--dark-gray);
  color: white;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #c1121f;
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
