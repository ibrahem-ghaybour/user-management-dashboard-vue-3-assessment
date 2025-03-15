import { ref, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Composable for debouncing a value change
 * 
 * @param value The reactive value to debounce
 * @param delay The delay in milliseconds
 * @returns An object with the debounced value and a cancel function
 * 
 * @example
 * const searchQuery = ref('');
 * const { debouncedValue } = useDebounce(searchQuery, 300);
 * 
 * // Watch the debounced value to perform API calls
 * watch(debouncedValue, (newValue) => {
 *   // Perform search with the debounced value
 *   fetchSearchResults(newValue);
 * });
 */
export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debouncedValue = ref(value.value) as Ref<T>;
  const timeoutId = ref<NodeJS.Timeout | null>(null);
  
  // Watch for changes in the original value
  watch(value, (newValue) => {
    // Clear any existing timeout
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
    
    // Set a new timeout
    timeoutId.value = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });
  
  // Function to cancel the debounce
  const cancel = () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }
  };
  
  return {
    debouncedValue,
    cancel
  };
}

export default useDebounce; 