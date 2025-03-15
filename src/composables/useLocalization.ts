import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useLocalizationStore } from '~/store/localization'
import type { SupportedLocale } from '~/store/localization'
import type { Composer } from 'vue-i18n'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Composable for handling localization in components
 * Provides easy access to i18n functions and language management
 */
export function useLocalization() {
  // Try to get i18n instance
  let i18n: Composer;
  try {
    i18n = useI18n();
  } catch (error) {
    // Create a fallback if i18n is not available (during SSR)
    const fallbackLocale = ref('en');
    i18n = {
      locale: fallbackLocale,
      t: (key: string) => key,
      d: (date: Date) => date.toISOString(),
      n: (num: number) => num.toString(),
    } as unknown as Composer;
  }

  const localizationStore = useLocalizationStore()

  // Available locales with their display names
  const availableLocales = computed(() => [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ])

  // Current locale
  const currentLocale = computed({
    get: () => i18n.locale.value as SupportedLocale,
    set: (newLocale: SupportedLocale) => {
      i18n.locale.value = newLocale
      localizationStore.setCurrentLocale(newLocale)
      
      // Only access browser APIs on client-side
      if (isBrowser) {
        localStorage.setItem('user-language', newLocale)
        document.querySelector('html')?.setAttribute('lang', newLocale)
      }
    }
  })

  // Get the display name of the current locale
  const currentLocaleName = computed(() => {
    const locale = availableLocales.value.find(l => l.code === currentLocale.value)
    return locale ? locale.name : 'English'
  })

  // Change the current locale
  const changeLocale = (locale: SupportedLocale) => {
    currentLocale.value = locale
  }

  // Format date using i18n
  const formatDate = (date: Date | string | number, format: 'short' | 'long' = 'short') => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return i18n.d(dateObj, format)
  }

  // Format number using i18n
  const formatNumber = (num: number, format: 'currency' | 'decimal' = 'decimal') => {
    if (format === 'currency') {
      return i18n.n(num, 'currency')
    }
    return i18n.n(num)
  }

  // Check if the app is ready (i18n loaded)
  const isReady = computed(() => !!i18n.locale.value)

  return {
    // Re-export i18n functions
    t: i18n.t,
    d: i18n.d,
    n: i18n.n,
    
    // Language management
    availableLocales,
    currentLocale,
    currentLocaleName,
    changeLocale,
    
    // Formatting helpers
    formatDate,
    formatNumber,
    
    // Status
    isReady
  }
} 