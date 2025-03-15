import { defineEventHandler, readBody, getQuery, createError } from 'h3';
import mockApi from '../mock/mockApi';
import type { UserFilters, SortDirection, CreateUserRequest } from '../../../types/user';

export default defineEventHandler(async (event) => {
  try {
    // Handle different HTTP methods
    switch (event.method) {
      case 'GET':
        // GET /api/users - List users with pagination, filtering, and sorting
        const query = getQuery(event);
        
        // Parse query parameters
        const page = query.page ? parseInt(query.page as string) : 1;
        const pageSize = query.pageSize ? parseInt(query.pageSize as string) : 10;
        const sortBy = query.sortBy as string | undefined;
        const sortDirection = query.sortDirection as SortDirection | undefined;
        
        // Build filters object from query parameters
        const filters: UserFilters = {};
        
        if (query.search) filters.search = query.search as string;
        if (query.role) filters.role = query.role as string;
        if (query.status) filters.status = query.status as string as any;
        if (query.department) filters.department = query.department as string;
      
        // Call mock API
        return await mockApi.getUsers(page, pageSize, filters, sortBy, sortDirection);
        
      case 'POST':
        // POST /api/users - Create user
        const userData = await readBody<CreateUserRequest>(event);
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'role', 'status'];
        for (const field of requiredFields) {
          if (!userData[field as keyof CreateUserRequest]) {
            throw createError({
              statusCode: 400,
              statusMessage: `Field '${field}' is required`
            });
          }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid email format'
          });
        }
        
        // Add missing properties required by the mockApi.createUser method
        const completeUserData = {
          ...userData,
          lastLogin: null,
          avatar: null
        };
        
        return await mockApi.createUser(completeUserData);
        
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
