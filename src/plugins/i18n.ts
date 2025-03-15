import { defineNuxtPlugin } from '#app'
import { createI18n } from 'vue-i18n'
import en from '~/i18n/locales/en.json'
import fr from '~/i18n/locales/fr.json'
import es from '~/i18n/locales/es.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      fr,
      es
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
    },
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
    }
  })

  vueApp.use(i18n)

  return {
    provide: {
      i18n: i18n.global
    }
  }
}) 