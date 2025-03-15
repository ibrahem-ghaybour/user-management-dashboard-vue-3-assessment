import { defineEventHandler, createError } from 'h3';
import mockApi from './mock/mockApi';

export default defineEventHandler(async (event) => {
  try {
    // Reset the mock data
    mockApi.resetMockData();
    
    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to reset mock data'
    });
  }
}); 