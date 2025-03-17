import { useAuthStore } from "~/store/auth";

type Permission = string;

export function usePermissions() {
  const { currentUser } = useAuthStore();
  const ADMIN_ROLE = "admin";

  function getDeletionPermissions(
    targetUser: Permission,
    defaultPermissions: Permission[] | Permission
  ): Permission[] {
    if (currentUser.role === ADMIN_ROLE && targetUser === ADMIN_ROLE) {
      return [""];
    }
    return Array.isArray(defaultPermissions)
      ? defaultPermissions
      : [defaultPermissions];
  }

  return {
    getDeletionPermissions,
  };
}
