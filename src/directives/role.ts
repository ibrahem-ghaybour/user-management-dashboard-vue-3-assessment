import type { ObjectDirective } from "vue";
import { useAuthStore } from "~/store/auth";

export const vRole: ObjectDirective<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updateElement(el, binding);
  },
  updated(el, binding) {
    updateElement(el, binding);
  },
};

function updateElement(el: HTMLElement, binding: any) {
  const authStore = useAuthStore();
  const permissions = binding.value;
  const mode = binding.arg || "remove"; // Default mode is 'remove'
  const requireAll = !binding.modifiers.any; // Default is to require all permissions

  let hasPermission = false;

  if (Array.isArray(permissions)) {
    // Check if user has all or any of the permissions
    if (requireAll) {
      hasPermission = permissions.every((permission) =>
        authStore.hasPermission(permission)
      );
    } else {
      hasPermission = permissions.some((permission) =>
        authStore.hasPermission(permission)
      );
    }
  } else {
    // Single permission check
    hasPermission = authStore.hasPermission(permissions);
  }

  // Apply the appropriate action based on the mode
  if (!hasPermission) {
    switch (mode) {
      case "disable":
        el.setAttribute("disabled", "disabled");
        // Add a class to indicate the element is disabled
        el.classList.add("permission-disabled");
        break;
      case "hide":
        el.style.display = "none";
        break;
      case "remove":
      default:
        // Remove the element from the DOM
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        break;
    }
  } else {
    // Ensure element is enabled and visible if the user has permission
    el.removeAttribute("disabled");
    el.classList.remove("permission-disabled");
    el.style.display = "";
  }
}

export default vRole;
