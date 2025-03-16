<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <h1 class="!text-[--text-color]">Unauthorized Access</h1>

      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="64"
          height="64"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"
            fill="#f56c6c"
          />
        </svg>
      </div>

      <p class="message">You don't have permission to access this page.</p>

      <div class="actions">
        <button @click="goBack" class="back-button">Go Back</button>
        <button @click="goToDashboard" class="dashboard-button">
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goBack = () => {
  router.back();
};

const goToDashboard = () => {
  router.push("/");
};
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.unauthorized-card {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background-color: var(--light-gray);
  color: var(--text-color) !important;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.icon {
  margin-bottom: 1.5rem;
}

.message {
  font-size: 1.125rem;
  color: #606266;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.back-button,
.dashboard-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button {
  background-color: #f0f2f5;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.back-button:hover {
  background-color: var(--light-gray);
}

.dashboard-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.dashboard-button:hover {
  opacity: 0.8;
}
</style>
