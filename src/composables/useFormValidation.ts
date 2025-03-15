import { ref, computed } from 'vue';
import type { Ref } from 'vue';

// Types for validation rules
type ValidationRule = (value: any) => boolean | string;
type ValidationRules = Record<string, ValidationRule[]>;
type ValidationErrors = Record<string, string | null>;

/**
 * Composable for form validation using Vue's reactivity system
 * 
 * @param initialValues Initial form values
 * @param validationRules Validation rules for each field
 * @returns An object with form values, errors, validation state, and helper methods
 * 
 * @example
 * const { 
 *   values, 
 *   errors, 
 *   isValid, 
 *   validateField, 
 *   validateForm, 
 *   resetForm 
 * } = useFormValidation(
 *   { name: '', email: '' },
 *   {
 *     name: [
 *       v => !!v || 'Name is required',
 *       v => v.length >= 3 || 'Name must be at least 3 characters'
 *     ],
 *     email: [
 *       v => !!v || 'Email is required',
 *       v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'
 *     ]
 *   }
 * );
 */
export function useFormValidation(
  initialValues: Record<string, any>,
  validationRules: ValidationRules
) {
  // Create reactive form values
  const values: Ref<Record<string, any>> = ref({ ...initialValues });
  
  // Create reactive errors object
  const errors: Ref<ValidationErrors> = ref(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {} as ValidationErrors)
  );
  
  // Track if form has been submitted
  const isSubmitted = ref(false);
  
  // Track if form is currently being validated
  const isValidating = ref(false);
  
  // Computed property to check if form is valid
  const isValid = computed(() => {
    return Object.values(errors.value).every(error => error === null);
  });
  
  // Computed property to check if form is dirty (values changed from initial)
  const isDirty = computed(() => {
    return Object.keys(initialValues).some(key => {
      return values.value[key] !== initialValues[key];
    });
  });
  
  // Validate a single field
  const validateField = (field: string): boolean => {
    const fieldRules = validationRules[field] || [];
    const value = values.value[field];
    
    // Run through all validation rules for the field
    for (const rule of fieldRules) {
      const result = rule(value);
      
      if (result !== true) {
        errors.value[field] = typeof result === 'string' ? result : 'Invalid value';
        return false;
      }
    }
    
    // If all rules pass, clear the error
    errors.value[field] = null;
    return true;
  };
  
  // Validate the entire form
  const validateForm = (): boolean => {
    isValidating.value = true;
    isSubmitted.value = true;
    
    let isFormValid = true;
    
    // Validate each field
    for (const field in validationRules) {
      const isFieldValid = validateField(field);
      isFormValid = isFormValid && isFieldValid;
    }
    
    isValidating.value = false;
    return isFormValid;
  };
  
  // Reset the form to initial values
  const resetForm = () => {
    // Reset values
    values.value = { ...initialValues };
    
    // Reset errors
    Object.keys(errors.value).forEach(key => {
      errors.value[key] = null;
    });
    
    // Reset submission state
    isSubmitted.value = false;
  };
  
  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitted,
    isValidating,
    validateField,
    validateForm,
    resetForm
  };
}

export default useFormValidation; 