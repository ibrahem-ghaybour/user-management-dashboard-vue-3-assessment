import { defineEventHandler, readBody, createError } from 'h3';
import mockApi from '../mock/mockApi';

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);
    
    // Validate required fields
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      });
    }
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, we'll fetch the first user from the mock API
    // In a real app, this would validate credentials against a database
    const result = await mockApi.getUsers(1, 1);
    
    if (result.data.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      });
    }
    
    const user = result.data[0];
    
    // Return the user and a mock token
    return {
      user,
      token: 'mock-jwt-token'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Authentication failed'
    });
  }
}); 