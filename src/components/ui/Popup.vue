<template>
  <Transition name="overlay"
    ><Teleport to="body">
      <div
        v-show="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center !z-50"
        @click.self="close"
      >
        <Transition name="popup">
          <div
            v-if="isOpen"
            :class="[
              `bg-background ov p-8 rounded-xl relative overflow-y-auto shadow-lg ${
                parentClass ? '' : 'max-w-[90%] max-h-[90vh]'
              }`,
              parentClass,
            ]"
          >
            <UiCloseButton
              class="rounded-full border w-7 h-7 text-[14px] flex justify-center items-center"
              @click="close"
            ></UiCloseButton>
            <slot></slot>
          </div>
        </Transition></div
    ></Teleport>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  parentClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isOpen", "close"]);

const close = () => {
  emit("update:isOpen", false);
  emit("close");
};
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(2);
}

.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
