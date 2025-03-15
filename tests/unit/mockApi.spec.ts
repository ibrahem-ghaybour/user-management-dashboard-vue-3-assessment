import { describe, it, expect, beforeEach } from 'vitest';
import { mockApi } from '../../src/server/api/mock/mockApi';
import type { UserStatus } from '../../src/types/user';

describe('Mock API', () => {
  // Reset mock data before each test
  beforeEach(() => {
    mockApi.resetMockData();
    mockApi.updateConfig({ failureProbability: 0 }); // Disable random failures for tests
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const result = await mockApi.getUsers(1, 10);
      
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);
      
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalItems).toBeGreaterThan(0);
      expect(result.pagination.totalPages).toBeGreaterThan(0);
    });

    it('should filter users by role', async () => {
      const result = await mockApi.getUsers(1, 50, { role: 'admin' });
      
      expect(result.data.every(user => user.role === 'admin')).toBe(true);
    });

    it('should filter users by status', async () => {
      const result = await mockApi.getUsers(1, 50, { status: 'active' });
      
      expect(result.data.every(user => user.status === 'active')).toBe(true);
    });

    it('should sort users by name', async () => {
      const result = await mockApi.getUsers(1, 50, undefined, 'name', 'asc');
      
      // Check if users are sorted by name
      for (let i = 1; i < result.data.length; i++) {
        const prevFullName = `${result.data[i-1].firstName} ${result.data[i-1].lastName}`.toLowerCase();
        const currFullName = `${result.data[i].firstName} ${result.data[i].lastName}`.toLowerCase();
        
        expect(prevFullName <= currFullName).toBe(true);
      }
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      // First get a list of users to get a valid ID
      const users = await mockApi.getUsers(1, 1);
      const userId = users.data[0].id;
      
      const user = await mockApi.getUser(userId);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    it('should throw an error for non-existent user', async () => {
      await expect(mockApi.getUser('999999')).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        role: 'user',
        status: 'active' as UserStatus,
        department: 'Testing',
        location: 'Remote',
        lastLogin: null,
        avatar: null
      };
      
      const createdUser = await mockApi.createUser(newUser);
      
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe(newUser.firstName);
      expect(createdUser.lastName).toBe(newUser.lastName);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.createdAt).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      // First get a list of users to get a valid ID
      const users = await mockApi.getUsers(1, 1);
      const userId = users.data[0].id;
      
      const updateData = {
        firstName: 'Updated',
        lastName: 'User'
      };
      
      const updatedUser = await mockApi.updateUser(userId, updateData);
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(userId);
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
    });

    it('should throw an error for non-existent user', async () => {
      await expect(mockApi.updateUser('999999', { firstName: 'Test' })).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      // First get a list of users to get a valid ID
      const users = await mockApi.getUsers(1, 1);
      const userId = users.data[0].id;
      
      await mockApi.deleteUser(userId);
      
      // Try to get the deleted user, should throw an error
      await expect(mockApi.getUser(userId)).rejects.toThrow();
    });

    it('should throw an error for non-existent user', async () => {
      await expect(mockApi.deleteUser('999999')).rejects.toThrow();
    });
  });

  describe('getRoles', () => {
    it('should return available roles', async () => {
      const roles = await mockApi.getRoles();
      
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBeGreaterThan(0);
      
      // Check role structure
      const role = roles[0];
      expect(role.id).toBeDefined();
      expect(role.name).toBeDefined();
      expect(Array.isArray(role.permissions)).toBe(true);
    });
  });
}); 