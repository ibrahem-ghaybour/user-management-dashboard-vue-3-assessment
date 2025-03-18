<template>
  <div class="user-actions flex gap-2">
    <button
      class="action-button view"
      @click="$emit('view', user)"
      :title="$t('common.view')"
      v-role="'settings:read'"
    >
      <img src="~/assets/icons/eye.svg" alt="" />
    </button>

    <button
      class="action-button edit"
      @click="$emit('edit', user)"
      :title="$t('common.edit')"
      v-role="getDeletionPermissions(user.role, 'users:write')"
    >
      <img src="~/assets/icons/edit.svg" alt="" />
    </button>

    <button
      class="action-button delete"
      @click="$emit('delete', user)"
      :title="$t('common.delete')"
      v-role="getDeletionPermissions(user.role, 'users:delete')"
    >
      <img src="~/assets/icons/delete.svg" alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";
// import { usePermissions } from "~/composables/usePermission";
// i18n
const { getDeletionPermissions } = usePermissions();
// Props
defineProps<{
  user: User;
}>();

// Emits
defineEmits<{
  (e: "view", user: User): void;
  (e: "edit", user: User): void;
  (e: "delete", user: User): void;
}>();
</script>

<style scoped>
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.2s ease;
}

.action-button:hover {
  @apply bg-[#2A9D8F] bg-opacity-20;
}
</style>
