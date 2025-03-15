<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="
      theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    "
    :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
  >
    <span v-if="theme === 'light'">
      <img
        src="~/assets/icons/moon.svg"
        class="icon"
        alt="Switch to dark mode"
      />
    </span>
    <span v-else>
      <img
        src="~/assets/icons/sun.svg"
        class="icon"
        alt="Switch to light mode"
      />
    </span>
  </button>
</template>

<script setup>
import { useThemeStore } from "~/store/theme";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
</script>

<style scoped>
.theme-toggle {
  /* Example styling */
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
