import { useAuthStore } from "~/store/auth";

export function usePermissions() {
  const { currentUser } = useAuthStore();
  const ADMIN_ROLE = "admin";

  function getDeletionPermissions(
    targetUser: string,
    defaultPermissions: string[] | string
  ): string[] {
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
