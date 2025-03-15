import { defineEventHandler, createError } from 'h3';
import { mockApi } from './mock/mockApi';

export default defineEventHandler(async (event) => {
  try {
    // GET /api/roles - Get available roles
    return await mockApi.getRoles();
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch roles'
    });
  }
}); 