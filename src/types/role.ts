export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleFilters {
  search?: string;
}

export interface RoleSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface RolePaginationOptions {
  page: number;
  limit: number;
}

export interface RolesResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
} 