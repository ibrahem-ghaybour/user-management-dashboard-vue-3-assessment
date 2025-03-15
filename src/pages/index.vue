<template>
  <div class="container mx-auto">
    <h2>Dashboard Home</h2>
    <div v-if="isLoading" class="loading-indicator">
      <UiLoading />
    </div>
    <div v-else-if="error" class="error-message">
      <p class="!text-white pb-2">{{ error }}</p>
      <button @click="fetchStats" class="btn btn-primary">Retry</button>
    </div>
    <div v-else class="dashboard-summary">
      <div class="summary-card">
        <h3>Total Users</h3>
        <p class="summary-number">{{ stats.totalUsers }}</p>
      </div>
      <div class="summary-card">
        <h3>Active Users</h3>
        <p class="summary-number">{{ stats.activeUsers }}</p>
      </div>
      <div class="summary-card">
        <h3>Admin Users</h3>
        <p class="summary-number">{{ stats.adminUsers }}</p>
      </div>
    </div>
    <div class="dashboard-actions">
      <NuxtLink to="/users" class="btn btn-primary">Manage Users</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStats } from "~/composables/useDashboardStats";

// Get dashboard statistics
const { stats, isLoading, error, fetchStats } = useDashboardStats();

// Fetch statistics when component is mounted
onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.summary-card {
  @apply bg-background-card rounded-lg shadow border border-border p-6;
}

.summary-number {
  @apply text-4xl font-bold text-primary my-2;
}

.dashboard-actions {
  @apply mt-8;
}

.loading-indicator {
  @apply text-center py-8 text-gray-medium;
}

.error-message {
  @apply bg-danger bg-opacity-10 text-danger p-4 rounded-lg my-4;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}
</style>
