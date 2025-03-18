<template>
  <div class="filter-controls max-lg:w-full">
    <button 
      class="filter-toggle" 
      @click="isExpanded = !isExpanded"
      :aria-expanded="isExpanded"
    >
      {{ $t('common.filter') }}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :class="{ 'rotate': isExpanded }"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    
    <div class="filter-panel" v-if="isExpanded">
      <div class="filter-row">
        <div class="filter-group">
          <label for="role-filter">{{ $t('users.role') }}</label>
          <select id="role-filter" v-model="filters.role" class="filter-select">
            <option value="">{{ $t('common.all') }}</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="status-filter">{{ $t('users.status') }}</label>
          <select id="status-filter" v-model="filters.status" class="filter-select">
            <option value="">{{ $t('common.all') }}</option>
            <option value="active">{{ $t('users.active') }}</option>
            <option value="inactive">{{ $t('users.inactive') }}</option>
            <option value="pending">{{ $t('users.pending') }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="department-filter">{{ $t('users.department') }}</label>
          <select id="department-filter" v-model="filters.department" class="filter-select">
            <option value="">{{ $t('common.all') }}</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="btn btn-secondary" @click="resetFilters">
          {{ $t('common.reset') }}
        </button>
        <button class="btn btn-primary" @click="applyFilters">
          {{ $t('common.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRolesStore } from '~/store/roles';
import type { UserFilters } from '~/types/user';

// Stores
const rolesStore = useRolesStore();

// Props
const props = defineProps({
  initialFilters: {
    type: Object as () => UserFilters,
    default: () => ({})
  }
});

// Emits
const emit = defineEmits<{
  (e: 'filter', filters: UserFilters): void;
}>();

// State
const isExpanded = ref(false);
const filters = reactive<UserFilters>({
  role: props.initialFilters.role || '',
  status: props.initialFilters.status || '',
  department: props.initialFilters.department || '',
  // Add more filters as needed
});

// Mock departments - in a real app, this would come from an API
const departments = ref([
  'Engineering',
  'Marketing',
  'Sales',
  'Customer Support',
  'Human Resources',
  'Finance'
]);

// Computed
const roles = ref(rolesStore.roles);

// Load roles if not already loaded
onMounted(async () => {
  if (roles.value.length === 0) {
    await rolesStore.fetchRoles();
    roles.value = rolesStore.roles;
  }
});

// Methods
function applyFilters() {
  emit('filter', { ...filters });
  isExpanded.value = false;
}

function resetFilters() {
  Object.keys(filters).forEach(key => {
    filters[key as keyof UserFilters] = '';
  });
  emit('filter', { ...filters });
}
</script>

<style scoped>
.filter-controls {
  position: relative;
  min-width: 150px;
  z-index: 20;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-color);
  cursor: pointer;
}

.filter-toggle:hover {
  border-color: var(--primary-color);
}

.filter-toggle svg {
  transition: transform 0.2s ease;
}

.filter-toggle svg.rotate {
  transform: rotate(180deg);
}

.filter-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 600px;
  max-width: 100vw;
  padding: 1rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-color);
}

.filter-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 0.875rem;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: var(--dark-gray);
  color: white;
}

@media (max-width: 768px) {
  .filter-panel {
    width: 100%;
    right: 0;
  }
  
  .filter-group {
    flex: 1 0 100%;
  }
}
</style>
