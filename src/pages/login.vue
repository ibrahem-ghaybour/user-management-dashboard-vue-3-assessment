<template>
  <ClientOnly>
    <div
      class="min-h-screen flex items-center justify-center p-8 bg-background"
    >
      <div class="w-full max-w-md bg-background-card rounded-lg shadow-md p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold mb-2">{{ $t("auth.login") }}</h1>
          <p class="text-text opacity-80">{{ $t("auth.loginSubtitle") }}</p>
        </div>

        <div v-if="error" class="bg-danger text-white p-3 rounded-md mb-6">
          {{ error }}
        </div>

        <div
          v-if="sessionExpired"
          class="bg-warning text-text p-3 rounded-md mb-6"
        >
          {{ $t("auth.sessionExpired") }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium">{{
              $t("auth.email")
            }}</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              :placeholder="$t('auth.emailPlaceholder')"
              required
              v-focus
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium">{{
              $t("auth.password")
            }}</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              :placeholder="$t('auth.passwordPlaceholder')"
              required
            />
          </div>

          <div class="flex items-center">
            <label class="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="mr-2 h-4 w-4"
              />
              <span>{{ $t("auth.rememberMe") }}</span>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            {{ isLoading ? $t("common.loading") : $t("auth.login") }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-border">
          <h3 class="text-lg font-semibold mb-2">{{ $t("auth.demoUsers") }}</h3>
          <p class="text-text opacity-80 mb-4">
            {{ $t("auth.demoUsersDescription") }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              class="btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
              @click="loginAs('admin@example.com', 'admin123')"
              :disabled="isLoading"
            >
              {{ $t("auth.loginAsAdmin") }}
            </button>

            <button
              class="btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
              @click="loginAs('manager@example.com', 'manager123')"
              :disabled="isLoading"
            >
              {{ $t("auth.loginAsManager") }}
            </button>

            <button
              class="btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
              @click="loginAs('user@example.com', 'user123')"
              :disabled="isLoading"
            >
              {{ $t("auth.loginAsUser") }}
            </button>

            <button
              class="btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white"
              @click="loginAs('guest@example.com', 'guest123')"
              :disabled="isLoading"
            >
              {{ $t("auth.loginAsGuest") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/store/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { $i18n } = useNuxtApp();

// Form state
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const rememberMe = ref(false);
const sessionExpired = ref(false);
const redirectPath = ref("/");
// Check for query parameters on mount
onMounted(() => {
  // Check if session expired
  if (route.query.expired === "true") {
    sessionExpired.value = true;
  }

  // Check if there's an error message
  if (route.query.error) {
    error.value = route.query.error as string;
  }

  // Check if there's a message
  if (route.query.message) {
    error.value = route.query.message as string;
  }

  // Check if there's a redirect path
  if (route.query.redirect) {
    redirectPath.value = route.query.redirect as string;
  }

  // Check if user is already logged in
  if (authStore.isAuthenticated) {
    router.push(redirectPath.value);
  }
});

// Handle login form submission
async function handleLogin() {
  if (isLoading.value) return;

  error.value = "";
  sessionExpired.value = false;
  isLoading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push(redirectPath.value);
  } catch (err: any) {
    error.value = err.message || $i18n.t("auth.loginError");
  } finally {
    isLoading.value = false;
  }
}

// Login as a predefined user
async function loginAs(userEmail: string, userPassword: string) {
  email.value = userEmail;
  password.value = userPassword;
  await handleLogin();
}
</script>
