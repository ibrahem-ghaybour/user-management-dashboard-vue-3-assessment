<template>
  <div class="language-selector">
    <label :for="id" class="sr-only">{{ $t('language.title') }}</label>
    <div class="language-selector-wrapper">
      <select
        :id="id"
        v-model="currentLocale"
        class="language-select"
        aria-label="Select language"
      >
        <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
          {{ locale.name }}
        </option>
      </select>
      <div class="language-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from '~/composables/useLocalization'

// Generate a unique ID for the select element
const id = `language-selector-${Math.random().toString(36).substring(2, 9)}`

// Use our localization composable
const { availableLocales, currentLocale } = useLocalization()
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.language-selector-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.language-select {
  appearance: none;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  transition: all 0.2s ease;
}

.language-select:hover {
  border-color: var(--primary-color);
}

.language-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.3);
}

.language-icon {
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
  color: var(--text-color);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style> 