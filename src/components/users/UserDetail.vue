<template>
  <div class="user-detail">
    <div class="card">
      <div class="card-header">
        <h3>{{ $t("users.title") }}</h3>
        <button
          class="btn btn-primary"
          @click="$emit('edit')"
          v-role="getDeletionPermissions(user.role, 'users:write')"
        >
          {{ $t("common.edit") }}
        </button>
      </div>

      <div class="card-body">
        <div class="user-info">
          <div class="info-group">
            <h4>{{ $t("users.name") }}</h4>
            <p>{{ `${user.firstName} ${user.lastName}` }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.email") }}</h4>
            <p>{{ user.email }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.role") }}</h4>
            <p>{{ getRoleName(user.role) }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.status") }}</h4>
            <p>
              <span :class="['status-badge', `status-${user.status}`]">
                {{ $t(`users.${user.status}`) }}
              </span>
            </p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.department") }}</h4>
            <p>{{ user.department || "-" }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.location") }}</h4>
            <p>{{ user.location || "-" }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.createdAt") }}</h4>
            <p>{{ formatDate(user.createdAt) }}</p>
          </div>

          <div class="info-group">
            <h4>{{ $t("users.lastLogin") }}</h4>
            <p>{{ user.lastLogin ? formatDate(user.lastLogin) : "-" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {ha}
import { useRolesStore } from "~/store/roles";
import { useLocalization } from "~/composables/useLocalization";
import { usePermissions } from "~/composables/usePermission";
import type { User } from "~/types/user";

// Props
defineProps<{
  user: User;
}>();

// Emits
defineEmits<{
  (e: "edit"): void;
}>();

// Stores and composables
const rolesStore = useRolesStore();
const { formatDate } = useLocalization();
const { getDeletionPermissions } = usePermissions();
// Get role name from role ID
function getRoleName(roleId: string): string {
  return rolesStore.getRoleName(roleId);
}
</script>

<style scoped>
.user-detail {
  margin-bottom: 2rem;
}

.card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-group h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  opacity: 0.7;
}

.info-group p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
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
</style>
