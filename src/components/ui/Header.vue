<template>
  <header
    class="fixed-header bg-background-card border-b border-border shadow-sm py-2 md:py-4 w-full z-50"
  >
    <div class="container px-4 mx-auto">
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0"
      >
        <!-- Logo / Title -->
        <h1 class="text-lg md:text-2xl font-semibold text-text-heading m-0">
          {{ $t("PulseBoard") }}
        </h1>

        <!-- Right Side Actions -->
        <div
          class="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto"
        >
          <!-- User Info + Logout -->
          <div class="flex items-center gap-2">
            <span class="text-sm md:text-base font-medium">{{
              authStore?.userFullName
            }}</span>
            <button
              v-if="authStore?.userFullName"
              class="bg-transparent border-none text-primary text-xs md:text-sm px-2 py-1 rounded hover:bg-gray-light cursor-pointer"
              @click="logout"
            >
              {{ $t("common.logout") }}
            </button>
          </div>

          <!-- Language Selector -->
          <LanguageSelector />

          <!-- Theme Toggle -->
          <ThemeToggle class="ml-0 md:ml-4" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "~/store/auth";
import { useThemeStore } from "~/store/theme";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";
import LanguageSelector from "~/components/ui/LanguageSelector.vue";
const router = useRouter();
const authStore = useAuthStore();
const { init } = useThemeStore();

async function logout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.app-header {
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--heading-color);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
