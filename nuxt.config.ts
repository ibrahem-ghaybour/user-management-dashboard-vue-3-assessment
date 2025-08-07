// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  srcDir: "src/",
  css: ["~/assets/css/main.css"],

  // Add Pinia for state management and Tailwind CSS
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],

  // Configure plugins
  plugins: ["~/plugins/index.ts", "~/plugins/directives.ts"],

  // Configure TypeScript
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // Configure app
  app: {
    head: {
      title: "User Management Dashboard",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "A Vue 3 application for managing users with a mock API implementation",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
  },

  // Configure routes
  routeRules: {
    "/login": { ssr: false },
    "/users/**": { ssr: false },
  },

  // Configure build
  build: {
    transpile: ["vue-i18n"],
  },

  // Configure vite
  vite: {
    define: {
      // Enable vue-i18n legacy API for better compatibility
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    viewer: false,
  },
});
