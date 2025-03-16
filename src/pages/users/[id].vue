<template>
  <div>
    <div class="page-header">
      <h2>{{ $t("users.editUser") }}</h2>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="goBack">
          {{ $t("common.back") }}
        </button>
        <button
          class="btn btn-danger"
          @click="showPopup = true"
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
      <UiLoading />
    </div>

    <template v-else>
      <UserDetail v-if="!isEditing" :user="user" @edit="startEditing" />
      <UserForm
        v-else
        :user="user"
        :is-new="false"
        @save="saveUser"
        @cancel="cancelEdit"
      />
    </template>
  </div>
  <UiPopup v-model:isOpen="showPopup" parentClass="max-lg:min-w-[80%]">
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">
        {{ $t("users.deleteConfirm") }}
      </h3>
      <button class="btn btn-primary" @click="confirmDelete">OK</button>
    </div></UiPopup
  >
</template>

<script setup lang="ts">
import { useUsersStore } from "~/store/users";
import { useRolesStore } from "~/store/roles";
import UserDetail from "~/components/users/UserDetail.vue";
import UserForm from "~/components/users/UserForm.vue";
import type { User, UpdateUserRequest } from "~/types/user";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const { $i18n } = useNuxtApp();

const showPopup = ref(false);
const popupMessage = ref("");

const userId = computed(() => route.params.id as string);

const isEditing = ref(false);
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

  isLoading.value = true;
  error.value = null;

  try {
    const userData = await usersStore.fetchUser(userId.value);
    user.value = userData;

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
  isEditing.value = false;
}

// Save user
async function saveUser(userData: UpdateUserRequest) {
  isLoading.value = true;
  error.value = null;

  try {
    await usersStore.updateUser(userId.value, userData);
    user.value = await usersStore.fetchUser(userId.value);
    isEditing.value = false;
  } catch (err: any) {
    error.value = err.message || $i18n.t("users.errorUpdating");
    console.error("Error updating user:", err);
  } finally {
    isLoading.value = false;
  }
}

// Delete user
async function confirmDelete() {
  if (user.value) {
    isLoading.value = true;
    error.value = null;
    try {
      await usersStore.deleteUser(userId.value);
      showPopup.value = false;
      router.push("/users");
    } catch (err: any) {
      error.value = err.message || $i18n.t("users.errorDeleting");
      console.error("Error deleting user:", err);
    } finally {
      isLoading.value = false;
      showPopup.value = false;
    }
  }
}
</script>

<style scoped>
@import "~/assets/css/UserCommon.css";
</style>
