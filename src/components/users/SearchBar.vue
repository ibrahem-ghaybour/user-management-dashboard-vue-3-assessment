<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input 
        type="text" 
        v-model="searchTerm" 
        :placeholder="$t('common.search')" 
        class="search-input"
        @input="debouncedSearch"
      />
      <button class="search-button" @click="search">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  }
});

// Emits
const emit = defineEmits<{
  (e: 'search', term: string): void;
}>();

// State
const searchTerm = ref(props.initialValue);

// Debounce search to avoid too many API calls
let debounceTimeout: NodeJS.Timeout | null = null;

function debouncedSearch() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  
  debounceTimeout = setTimeout(() => {
    search();
  }, 300);
}

function search() {
  emit('search', searchTerm.value);
}

// Watch for external changes to initialValue
watch(() => props.initialValue, (newValue) => {
  searchTerm.value = newValue;
});
</script>

<style scoped>
.search-bar {
  flex: 1;
  min-width: 250px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: var(--card-background);
  color: var(--text-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.search-button:hover {
  color: var(--primary-color);
}
</style>
