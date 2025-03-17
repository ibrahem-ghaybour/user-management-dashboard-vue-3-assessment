import { defineEventHandler, readBody, createError } from "h3";
import mockApi from "./mock/mockApi";

export default defineEventHandler(async (event) => {
  try {
    const config = await readBody(event);

    // Validate the configuration
    if (typeof config !== "object" || config === null) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid configuration",
      });
    }

    // Update the mock API configuration
    mockApi.updateConfig(config);

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to update mock API configuration",
    });
  }
});
