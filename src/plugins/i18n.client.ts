import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { useLocalizationStore } from '~/store/localization'
import type { SupportedLocale } from '~/store/localization'
import type { I18n, Composer } from 'vue-i18n'

/**
 * Plugin to handle client-side i18n functionality
 * This runs only on the client side
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export default defineNuxtPlugin((nuxtApp) => {
  // Function to initialize language based on user preference
  const initializeLanguage = () => {
    // Get the i18n instance that was already provided by the main i18n plugin
    const i18n = nuxtApp.$i18n as Composer
    if (!i18n) {
      console.warn('i18n instance not available in client plugin')
      return
    }

    const localizationStore = useLocalizationStore()
    
    // Only access localStorage in browser environment
    if (isBrowser) {
      const storedLanguage = localStorage.getItem('user-language')
      
      // Set language from localStorage if available
      if (storedLanguage) {
        // Validate that the stored language is a supported locale
        const validatedLocale = isValidLocale(storedLanguage) ? storedLanguage : 'en'
        i18n.locale.value = validatedLocale
        document.querySelector('html')?.setAttribute('lang', validatedLocale)
        localizationStore.setCurrentLocale(validatedLocale)
      } else {
        // Default to browser language or fallback to English
        const browserLanguage = navigator.language.split('-')[0]
        const validatedLocale = isValidLocale(browserLanguage) ? browserLanguage : 'en'
        i18n.locale.value = validatedLocale
        localStorage.setItem('user-language', validatedLocale)
        document.querySelector('html')?.setAttribute('lang', validatedLocale)
        localizationStore.setCurrentLocale(validatedLocale)
      }
    }
  }

  // Helper function to validate locale
  const isValidLocale = (locale: string): locale is SupportedLocale => {
    return ['en', 'fr', 'es'].includes(locale)
  }

  // Initialize language after app is mounted
  if (isBrowser) {
    nuxtApp.hook('app:mounted', () => {
      initializeLanguage()
      
      // Watch for locale changes and update localStorage
      const i18n = nuxtApp.$i18n as Composer
      if (i18n && i18n.locale) {
        // Use Vue's watch function to observe changes to the locale
        watch(i18n.locale, (newLocale: string) => {
          if (isBrowser && isValidLocale(newLocale)) {
            localStorage.setItem('user-language', newLocale)
            document.querySelector('html')?.setAttribute('lang', newLocale)
          }
        })
      }
    })
  }
}) 