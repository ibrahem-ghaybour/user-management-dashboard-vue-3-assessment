<template>
  <div>
    <NuxtLayout>
      <Transition name="fade" mode="out-in">
        <div>
          <NuxtPage />
        </div>
      </Transition>
    </NuxtLayout>
  </div>
</template>
<script setup>

</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
}

</style>
