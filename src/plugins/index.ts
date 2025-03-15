/**
 * This file exports all plugins to ensure they are loaded in the correct order.
 * 
 * Loading order:
 * 1. API plugin must be loaded before mockApi plugin
 * 2. i18n plugin must be loaded before i18n.client plugin
 * 3. Other plugins can be loaded in any order
 */

// API plugins
export { default as apiPlugin } from './api';
export { default as mockApiPlugin } from './mockApi';

// i18n plugins
export { default as i18nPlugin } from './i18n';
export { default as i18nClientPlugin } from './i18n.client';

// Other plugins
export { default as directivesPlugin } from './directives';
export { default as themeClientPlugin } from './theme.client';

// Default export to satisfy Nuxt's plugin system
export default defineNuxtPlugin(() => {
  // This plugin doesn't need to do anything specific
  // It's just a container for other plugins
  console.log('Plugins index loaded');
}); 