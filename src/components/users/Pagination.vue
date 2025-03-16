<template>
  <div class="pagination">
    <div
      class="flex flex-col items-center mt-6 space-y-4"
      v-if="usersStore.totalPages > 1"
    >
      <div class="flex space-x-2">
        <button
          v-for="page in usersStore.totalPages"
          :key="page"
          class="btn btn-secondary"
          :class="{
            'bg-background text-primary border-[2px] border-primary':
              page === usersStore.currentPage,
          }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <button
          class="btn btn-secondary"
          :disabled="!usersStore.hasPreviousPage"
          @click="usersStore.previousPage()"
        >
          {{ $t("common.back") }}
        </button>
        <span>{{
          $t("pagination.showing", {
            from: (usersStore.currentPage - 1) * 10 + 1,
            to: Math.min(usersStore.currentPage * 10, usersStore.totalUsers),
            total: usersStore.totalUsers,
          })
        }}</span>
        <button
          class="btn btn-secondary"
          :disabled="!usersStore.hasNextPage"
          @click="usersStore.nextPage()"
        >
          {{ $t("common.next") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/store/users";
const usersStore = useUsersStore();
function handlePageChange(page: number) {
  usersStore.goToPage(page);
}
</script>

<style lang="scss" scoped></style>
