import type { ObjectDirective } from 'vue';

/**
 * Custom directive for automatically focusing elements
 * 
 * Usage:
 * v-focus                  - Focus the element when mounted
 * v-focus:delay="500"      - Focus after a delay (in ms)
 * v-focus.select           - Focus and select all text (for inputs)
 * 
 * @example <input v-focus>
 * @example <input v-focus:delay="300">
 * @example <input v-focus.select>
 */
export const vFocus: ObjectDirective<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const delay = binding.arg === 'delay' ? binding.value || 0 : 0;
    const shouldSelect = binding.modifiers.select;
    
    setTimeout(() => {
      if (el instanceof HTMLElement) {
        el.focus();
        
        // If the element is an input or textarea and select modifier is present
        if (shouldSelect && 
            (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
          el.select();
        }
      }
    }, delay);
  }
};

export default vFocus; 