import { defineStore } from 'pinia'

// Type for supported locales
export type SupportedLocale = 'en' | 'fr' | 'es'

interface LocalizationState {
  currentLocale: SupportedLocale
}

export const useLocalizationStore = defineStore('localization', {
  state: (): LocalizationState => ({
    currentLocale: 'en'
  }),
  
  actions: {
    setCurrentLocale(locale: SupportedLocale) {
      this.currentLocale = locale
    }
  },
  
  getters: {
    getCurrentLocale(): SupportedLocale {
      return this.currentLocale
    }
  }
}) 