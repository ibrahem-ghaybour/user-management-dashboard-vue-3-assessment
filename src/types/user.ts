// User status types
export type UserStatus = 'active' | 'inactive' | 'pending';

// Sort direction type
export type SortDirection = 'asc' | 'desc';

// Role interface
export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  location?: string;
  createdAt: string;
  lastLogin?: string;
}

// Pagination interface
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// User filters interface
export interface UserFilters {
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  department?: string;
  search?: string;
}

// Create user request interface
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  location?: string;
}

// Update user request interface
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: UserStatus;
  department?: string;
  location?: string;
}
