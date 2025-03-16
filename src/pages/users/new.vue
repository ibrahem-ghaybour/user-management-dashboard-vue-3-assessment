<template>
  <div>
    <div class="page-header">
      <h2>{{ $t("users.newUser") }}</h2>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="goBack">
          {{ $t("common.back") }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="isLoading" class="loading-indicator">
      <UiLoading />
    </div>

    <template v-else>
      <UserForm
        :user="user"
        :is-new="true"
        @save="saveUser"
        @cancel="cancelEdit"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/store/users";
import { useRolesStore } from "~/store/roles";
import UserForm from "~/components/users/UserForm.vue";
import type { User, CreateUserRequest } from "~/types/user";

definePageMeta({
  requiredPermissions: ["users:write"],
});

const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { $i18n } = useNuxtApp();

const isLoading = ref(false);
const error = ref<string | null>(null);

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

onMounted(async () => {
  if (rolesStore.roles.length === 0) {
    await rolesStore.fetchRoles();
  }
});

// Navigation
function goBack() {
  router.push("/users");
}

function cancelEdit() {
  goBack();
}

// Save user
async function saveUser(userData: CreateUserRequest) {
  isLoading.value = true;
  error.value = null;

  try {
    const newUser = await usersStore.createUser(userData);
    router.push(`/users/${newUser.id}`);
  } catch (err: any) {
    error.value = err.message || $i18n.t("users.errorCreating");
    console.error("Error creating user:", err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import "~/assets/css/UserCommon.css";
</style>
