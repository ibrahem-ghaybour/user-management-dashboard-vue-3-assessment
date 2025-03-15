import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'

// Type for language codes
export type LanguageCode = 'en' | 'fr' | 'es'

// Available languages
export const availableLanguages: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
]

// Create i18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language
  messages: {
    en,
    fr,
    es
  },
  // Enable HTML in translations (use with caution for security)
  warnHtmlInMessage: 'off',
  // Disable warnings for missing translations in development
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  // Disable fallback warnings
  silentFallbackWarn: true,
  // Format for datetime, number, etc.
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    fr: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      }
    },
    es: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      }
    }
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    fr: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    es: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

// Helper function to change language
export function setLanguage(lang: LanguageCode): void {
  i18n.global.locale.value = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  localStorage.setItem('user-language', lang)
}

// Helper function to get current language
export function getCurrentLanguage(): LanguageCode {
  return i18n.global.locale.value as LanguageCode
}

// Export the plugin for Vue app
export default i18n 