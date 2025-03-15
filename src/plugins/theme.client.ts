import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  // This plugin runs only on the client side
  
  // Get theme from localStorage
  const storedTheme = localStorage.getItem('theme');
  
  // Apply theme class before Vue mounts to prevent flash of wrong theme
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark-theme');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Check system preference if no stored preference
    document.documentElement.classList.add('dark-theme');
  }
}); 