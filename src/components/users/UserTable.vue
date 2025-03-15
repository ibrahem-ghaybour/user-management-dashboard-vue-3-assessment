<template>
  <div class="user-table-container p-2">
    <table class="user-table">
      <thead>
        <tr>
          <th @click="sortBy('firstName')">
            {{ $t('users.fullName') }}
            <span v-if="sortField === 'firstName'" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortBy('email')">
            {{ $t('users.email') }}
            <span v-if="sortField === 'email'" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortBy('role')">
            {{ $t('users.role') }}
            <span v-if="sortField === 'role'" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortBy('status')">
            {{ $t('users.status') }}
            <span v-if="sortField === 'status'" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="sortBy('createdAt')">
            {{ $t('users.createdAt') }}
            <span v-if="sortField === 'createdAt'" class="sort-indicator">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td :data-label="$t('users.fullName')">
            {{ `${user.firstName} ${user.lastName}` }}
          </td>
          <td :data-label="$t('users.email')">
            {{ user.email }}
          </td>
          <td :data-label="$t('users.role')">
            {{ getRoleName(user.role) }}
          </td>
          <td :data-label="$t('users.status')">
            <span :class="['status-badge', `status-${user.status}`]">
              {{ $t(`users.${user.status}`) }}
            </span>
          </td>
          <td :data-label="$t('users.createdAt')">
            {{ formatDate(user.createdAt) }}
          </td>
          <td :data-label="$t('common.actions')">
            <UserActions
              :user="user"
              @view="viewUser"
              @edit="editUser"
              @delete="confirmDelete"
            />
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="6" class="no-data">{{ $t('common.noData') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRolesStore } from '~/store/roles';
import { useLocalization } from '~/composables/useLocalization';
import { useI18n } from 'vue-i18n';
import UserActions from './UserActions.vue';
import type { User } from '~/types/user';

const router = useRouter();
const rolesStore = useRolesStore();
const { formatDate } = useLocalization();
const { t } = useI18n();

// Props
const props = defineProps<{
  users: User[];
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
}>();

// Emits
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
  (e: 'sort', field: string, direction: 'asc' | 'desc'): void;
  (e: 'delete', userId: string): void;
}>();

// Sorting state
const sortField = ref<string>('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');

// Get role name from role ID
function getRoleName(roleId: string): string {
  return rolesStore.getRoleName(roleId);
}

// Navigation functions
function viewUser(user: User) {
  router.push(`/users/${user.id}`);
}

function editUser(user: User) {
  router.push(`/users/${user.id}?edit=true`);
}

function confirmDelete(user: User) {
  if (confirm(t('users.deleteConfirm'))) {
    emit('delete', user.id);
  }
}

// Sorting function
function sortBy(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }

  emit('sort', sortField.value, sortDirection.value);
}
</script>

<style scoped>
.user-table-container {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--card-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-table th,
.user-table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.user-table th {
  background-color: var(--medium-gray);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.user-table th:hover {
  background-color: var(--dark-gray);
  color: white;
}

.sort-indicator {
  margin-left: 0.5rem;
  font-weight: bold;
}

.user-table tbody tr:nth-child(even) {
  background-color: var(--light-gray);
}

.user-table tbody tr:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background-color: var(--success-color);
  color: white;
}

.status-inactive {
  background-color: var(--dark-gray);
  color: white;
}

.status-pending {
  background-color: var(--warning-color);
  color: var(--text-color);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--dark-gray);
}

/* Responsive Styling */
@media (max-width: 768px) {
  .user-table thead {
    display: none;
  }

  .user-table,
  .user-table tbody,
  .user-table tr,
  .user-table td {
    display: block;
    width: 100%;
  }

  .user-table tbody tr {
    margin-bottom: 1rem;
    border-radius: 8px;
    background-color: var(--light-gray);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }

  .user-table tbody tr td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    text-align: left;
    border-bottom: 1px solid var(--medium-gray);
  }

  .user-table tbody tr td:last-child {
    border-bottom: none;
  }

  .user-table tbody tr td::before {
    content: attr(data-label);
    font-weight: bold;
    flex-basis: 50%;
    color: var(--dark-gray);
  }
}
</style>
