import type { User, Role, UserStatus, PaginatedResponse, UserFilters, SortDirection } from '../../../types/user';

// Configuration for the mock API
const config = {
  // Latency range in milliseconds
  minLatency: 300,
  maxLatency: 800,
  // Probability of request failure (0-1)
  failureProbability: 0.05,
  // Default page size for pagination
  defaultPageSize: 10
};

// Available roles with permissions
const roles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write', 'reports:read', 'reports:write']
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: ['users:read', 'users:write', 'reports:read', 'reports:write']
  },
  {
    id: 'user',
    name: 'Regular User',
    permissions: ['users:read', 'reports:read']
  },
  {
    id: 'guest',
    name: 'Guest',
    permissions: ['users:read']
  }
];

// Generate mock user data
const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Christopher', 'Isabella', 'Andrew', 'Mia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
  const domains = ['example.com', 'testmail.com', 'mockdata.org', 'fakecorp.net', 'demosite.io'];
  const statuses: UserStatus[] = ['active', 'inactive', 'pending'];
  const roleIds = roles.map(role => role.id);

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const roleId = roleIds[Math.floor(Math.random() * roleIds.length)];
    
    // Create date between 1-3 years ago
    const createdAt = new Date();
    createdAt.setFullYear(createdAt.getFullYear() - Math.floor(Math.random() * 3) - 1);
    createdAt.setDate(Math.floor(Math.random() * 365));
    
    // Create a random last login date (some users might not have logged in yet)
    let lastLogin = null;
    if (Math.random() > 0.2) {
      lastLogin = new Date();
      lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 60));
    }

    users.push({
      id: i.toString(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      role: roleId,
      status,
      createdAt: createdAt.toISOString(),
      lastLogin: lastLogin ? lastLogin.toISOString() : null,
      department: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Support'][Math.floor(Math.random() * 6)],
      location: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Remote'][Math.floor(Math.random() * 7)]
    });
  }

  return users;
};

// Generate 55 mock users
const mockUsers = generateMockUsers(55);

// Simulate network latency
const simulateLatency = async (): Promise<void> => {
  const latency = Math.floor(Math.random() * (config.maxLatency - config.minLatency + 1)) + config.minLatency;
  return new Promise(resolve => setTimeout(resolve, latency));
};

// Simulate random failures
const simulateFailure = async (): Promise<boolean> => {
  return Math.random() < config.failureProbability;
};

// Filter users based on criteria
const filterUsers = (users: User[], filters?: UserFilters): User[] => {
  if (!filters) return users;

  return users.filter(user => {
    // Filter by search term (name or email)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      if (!fullName.includes(searchTerm) && !user.email.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Filter by role
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    // Filter by status
    if (filters.status && user.status !== filters.status) {
      return false;
    }

    // Filter by department
    if (filters.department && user.department !== filters.department) {
      return false;
    }

    return true;
  });
};

// Sort users based on field and direction
const sortUsers = (users: User[], sortBy?: string, sortDirection: SortDirection = 'asc'): User[] => {
  if (!sortBy) return users;

  return [...users].sort((a: any, b: any) => {
    let valueA, valueB;

    // Handle special case for full name
    if (sortBy === 'name') {
      valueA = `${a.firstName} ${a.lastName}`;
      valueB = `${b.firstName} ${b.lastName}`;
    } else {
      valueA = a[sortBy as keyof User];
      valueB = b[sortBy as keyof User];
    }

    // Handle null values
    if (valueA === null && valueB === null) return 0;
    if (valueA === null) return sortDirection === 'asc' ? -1 : 1;
    if (valueB === null) return sortDirection === 'asc' ? 1 : -1;

    // Compare dates
    if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    // Compare strings case-insensitive
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

// Paginate users
const paginateUsers = (users: User[], page: number, pageSize: number): PaginatedResponse<User> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  return {
    data: paginatedUsers,
    pagination: {
      page,
      pageSize,
      totalItems: users.length,
      totalPages: Math.ceil(users.length / pageSize)
    }
  };
};

// Mock API implementation
export const mockApi = {
  // Get users with pagination, filtering, and sorting
  async getUsers(
    page: number = 1,
    pageSize: number = config.defaultPageSize,
    filters?: UserFilters,
    sortBy?: string,
    sortDirection?: SortDirection
  ): Promise<PaginatedResponse<User>> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error('Failed to fetch users. Please try again.');
    }
    
    let filteredUsers = filterUsers(mockUsers, filters);
    filteredUsers = sortUsers(filteredUsers, sortBy, sortDirection);
    
    return paginateUsers(filteredUsers, page, pageSize);
  },
  
  // Get a specific user by ID
  async getUser(id: string): Promise<User> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error(`Failed to fetch user with ID ${id}. Please try again.`);
    }
    
    const user = mockUsers.find(user => user.id === id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found.`);
    }
    
    return user;
  },
  
  // Update a user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error(`Failed to update user with ID ${id}. Please try again.`);
    }
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      // Don't allow changing the ID
      id: mockUsers[userIndex].id
    };
    
    return mockUsers[userIndex];
  },
  
  // Create a new user
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error('Failed to create user. Please try again.');
    }
    
    // Generate a new ID (max ID + 1)
    const maxId = Math.max(...mockUsers.map(user => parseInt(user.id)));
    const newId = (maxId + 1).toString();
    
    const newUser: User = {
      id: newId,
      createdAt: new Date().toISOString(),
      ...userData
    };
    
    mockUsers.push(newUser);
    
    return newUser;
  },
  
  // Delete a user
  async deleteUser(id: string): Promise<void> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error(`Failed to delete user with ID ${id}. Please try again.`);
    }
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }
    
    mockUsers.splice(userIndex, 1);
  },
  
  // Get available roles
  async getRoles(): Promise<Role[]> {
    await simulateLatency();
    
    if (await simulateFailure()) {
      throw new Error('Failed to fetch roles. Please try again.');
    }
    
    return roles;
  },

  // For testing: get the current configuration
  getConfig() {
    return { ...config };
  },
  
  // For testing: update the configuration
  updateConfig(newConfig: Partial<typeof config>) {
    Object.assign(config, newConfig);
  },
  
  // For testing: reset the mock data
  resetMockData() {
    mockUsers.length = 0;
    mockUsers.push(...generateMockUsers(55));
  }
};

export default mockApi; 