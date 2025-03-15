import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock Nuxt's composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    },
    $mockApi: {
      getConfig: vi.fn(),
      updateConfig: vi.fn(),
      resetMockData: vi.fn(),
      simulateFailure: vi.fn()
    }
  }),
  defineNuxtPlugin: vi.fn(),
  defineNuxtRouteMiddleware: vi.fn(),
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    path: '/',
    meta: {}
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  }))
}));

// Mock fetch for API calls
global.fetch = vi.fn();

// Setup Vue Test Utils global config
config.global.stubs = {
  NuxtLink: true,
  NuxtPage: true,
  ClientOnly: true
}; 