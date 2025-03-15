import { defineNuxtPlugin } from '#app';
import vRole from '~/directives/role';
import vFocus from '~/directives/focus';

export default defineNuxtPlugin((nuxtApp) => {
  // Register custom directives
  nuxtApp.vueApp.directive('role', vRole);
  nuxtApp.vueApp.directive('focus', vFocus);
}); 