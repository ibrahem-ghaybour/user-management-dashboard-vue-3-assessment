import { defineEventHandler, readBody, createError } from 'h3';
import mockApi from '../mock/mockApi';
import type { UpdateUserRequest } from '../../../types/user';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      });
    }
    
    // Handle different HTTP methods
    switch (event.method) {
      case 'GET':
        // GET /api/users/{id} - Get specific user
        return await mockApi.getUser(id);
        
      case 'PUT':
        // PUT /api/users/{id} - Update user
        const updateData = await readBody<UpdateUserRequest>(event);
        return await mockApi.updateUser(id, updateData);
        
      case 'DELETE':
        // DELETE /api/users/{id} - Delete user
        await mockApi.deleteUser(id);
        return { success: true, message: `User with ID ${id} deleted successfully` };
        
      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method not allowed'
        });
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'An error occurred'
    });
  }
}); 