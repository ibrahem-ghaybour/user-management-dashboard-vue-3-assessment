import { ref } from 'vue';
import type { Ref } from 'vue';
import { useNuxtApp } from '#app';
import type { User, CreateUserRequest, UpdateUserRequest } from '~/types/user';

export function useUser() {
  const { $api } = useNuxtApp();
  const user: Ref<User | null> = ref(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch a user by ID
  async function fetchUser(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      user.value = await $api.get<User>(`users/${id}`);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user';
      console.error('Error fetching user:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Create a new user
  async function createUser(userData: CreateUserRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      user.value = await $api.post<User>('users', userData);
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to create user';
      console.error('Error creating user:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Update an existing user
  async function updateUser(id: string, userData: UpdateUserRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      user.value = await $api.put<User>(`users/${id}`, userData);
      return user.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to update user';
      console.error('Error updating user:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Delete a user
  async function deleteUser(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await $api.delete<{ success: boolean; message: string }>(`users/${id}`);
      user.value = null;
      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user';
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isLoading,
    error,
    fetchUser,
    createUser,
    updateUser,
    deleteUser
  };
} 