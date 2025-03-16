<template>
  <select 
    :value="modelValue" 
    @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="role-selector"
  >
    <option value="" disabled>{{ $t('users.selectRole') }}</option>
    <option 
      v-for="role in roles" 
      :key="role.id" 
      :value="role.id"
    >
      {{ role.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useRolesStore } from '~/store/roles';
// Props
const props = defineProps<{
  modelValue: string;
}>();

// Emits
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Stores and composables
const rolesStore = useRolesStore();
// Computed
const roles = computed(() => {
  return rolesStore.roles;
});
</script>

<style scoped>
.role-selector {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 1rem;
}

.role-selector:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}
</style>
