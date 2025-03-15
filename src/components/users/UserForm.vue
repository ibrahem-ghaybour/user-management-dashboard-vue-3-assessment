<template>
  <div class="user-form">
    <div class="card">
      <div class="card-header">
        <h3>{{ isNew ? $t('users.newUser') : $t('users.editUser') }}</h3>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">{{ $t('users.firstName') }}</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="formData.firstName" 
                class="form-control"
                :class="{ 'is-invalid': errors.firstName }"
                required
              />
              <div v-if="errors.firstName" class="error-message">
                {{ errors.firstName }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">{{ $t('users.lastName') }}</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="formData.lastName" 
                class="form-control"
                :class="{ 'is-invalid': errors.lastName }"
                required
              />
              <div v-if="errors.lastName" class="error-message">
                {{ errors.lastName }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">{{ $t('users.email') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                required
              />
              <div v-if="errors.email" class="error-message">
                {{ errors.email }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="role">{{ $t('users.role') }}</label>
              <RoleSelector 
                id="role" 
                v-model="formData.role" 
                class="form-control"
                :class="{ 'is-invalid': errors.role }"
                required
              />
              <div v-if="errors.role" class="error-message">
                {{ errors.role }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="status">{{ $t('users.status') }}</label>
              <select 
                id="status" 
                v-model="formData.status" 
                class="form-control"
                :class="{ 'is-invalid': errors.status }"
                required
              >
                <option value="active">{{ $t('users.active') }}</option>
                <option value="inactive">{{ $t('users.inactive') }}</option>
                <option value="pending">{{ $t('users.pending') }}</option>
              </select>
              <div v-if="errors.status" class="error-message">
                {{ errors.status }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="department">{{ $t('users.department') }}</label>
              <input 
                type="text" 
                id="department" 
                v-model="formData.department" 
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="location">{{ $t('users.location') }}</label>
              <input 
                type="text" 
                id="location" 
                v-model="formData.location" 
                class="form-control"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRolesStore } from '~/store/roles';
import RoleSelector from './RoleSelector.vue';
import type { User, CreateUserRequest, UpdateUserRequest } from '~/types/user';

// Props
const props = defineProps<{
  user?: User;
  isNew?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'save', formData: CreateUserRequest | UpdateUserRequest): void;
  (e: 'cancel'): void;
}>();

// Stores and composables
const rolesStore = useRolesStore();

const { $i18n } = useNuxtApp()
// State
const isSubmitting = ref(false);
const formData = reactive<CreateUserRequest | UpdateUserRequest>({
  firstName: props.user?.firstName || '',
  lastName: props.user?.lastName || '',
  email: props.user?.email || '',
  role: props.user?.role || '',
  status: props.user?.status || 'active',
  department: props.user?.department || '',
  location: props.user?.location || ''
});

const errors = reactive<Record<string, string>>({});

// Computed
const isNew = computed(() => props.isNew === true);

// Load roles if not already loaded
onMounted(async () => {
  if (rolesStore.roles.length === 0) {
    await rolesStore.fetchRoles();
  }
});

// Form validation
function validateForm(): boolean {
  errors.firstName = !formData.firstName ? $i18n.t('validation.required', { field: $i18n.t('users.firstName') }) : '';
  errors.lastName = !formData.lastName ? $i18n.t('validation.required', { field: $i18n.t('users.lastName') }) : '';
  errors.email = !formData.email ? $i18n.t('validation.required', { field: $i18n.t('users.email') }) : '';
  errors.role = !formData.role ? $i18n.t('validation.required', { field: $i18n.t('users.role') }) : '';
  errors.status = !formData.status ? $i18n.t('validation.required', { field: $i18n.t('users.status') }) : '';
  
  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = $i18n.t('validation.email');
  }
  
  return !Object.values(errors).some(error => error);
}

// Form submission
function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    emit('save', { ...formData });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.user-form {
  margin-bottom: 2rem;
}

.card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.5rem;
  background-color: var(--medium-gray);
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--heading-color);
}

.card-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.form-control.is-invalid {
  border-color: var(--danger-color);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
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

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-primary:disabled {
  background-color: var(--medium-gray);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--medium-gray);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: var(--dark-gray);
  color: white;
}
</style>
