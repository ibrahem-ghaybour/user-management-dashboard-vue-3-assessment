import { useAuthStore } from "~/store/auth";

type Permission = string;

export function usePermissions() {
  const { currentUser } = useAuthStore();
  const ADMIN_ROLE = "admin";

  function getDeletionPermissions(
    targetUser: Permission,
    defaultPermissions: Permission[] | Permission
  ): Permission[] {
    if (targetUser === ADMIN_ROLE || currentUser.role === targetUser) {
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
