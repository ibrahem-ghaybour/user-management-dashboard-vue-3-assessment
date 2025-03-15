import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { useDebounce } from '~/composables/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    // Setup
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Cleanup
    vi.restoreAllMocks();
  });

  it('should initialize with the original value', () => {
    const originalValue = ref('test');
    const { debouncedValue } = useDebounce(originalValue);
    
    expect(debouncedValue.value).toBe('test');
  });

  it('should not update debounced value immediately when original value changes', () => {
    const originalValue = ref('test');
    const { debouncedValue } = useDebounce(originalValue);
    
    originalValue.value = 'updated';
    
    expect(debouncedValue.value).toBe('test');
  });

  it('should update debounced value after delay when original value changes', async () => {
    const originalValue = ref('test');
    const { debouncedValue } = useDebounce(originalValue, 300);
    
    originalValue.value = 'updated';
    
    // Fast-forward time
    vi.advanceTimersByTime(300);
    
    expect(debouncedValue.value).toBe('updated');
  });

  it('should cancel pending debounce when cancel is called', () => {
    const originalValue = ref('test');
    const { debouncedValue, cancel } = useDebounce(originalValue, 300);
    
    originalValue.value = 'updated';
    
    // Cancel the debounce
    cancel();
    
    // Fast-forward time
    vi.advanceTimersByTime(300);
    
    // Value should not be updated
    expect(debouncedValue.value).toBe('test');
  });

  it('should reset timeout when value changes multiple times', () => {
    const originalValue = ref('test');
    const { debouncedValue } = useDebounce(originalValue, 300);
    
    originalValue.value = 'update1';
    
    // Fast-forward time partially
    vi.advanceTimersByTime(200);
    
    // Value should not be updated yet
    expect(debouncedValue.value).toBe('test');
    
    // Change value again
    originalValue.value = 'update2';
    
    // Fast-forward time partially again
    vi.advanceTimersByTime(200);
    
    // Value should still not be updated
    expect(debouncedValue.value).toBe('test');
    
    // Fast-forward remaining time
    vi.advanceTimersByTime(100);
    
    // Now the value should be updated to the latest value
    expect(debouncedValue.value).toBe('update2');
  });
}); 