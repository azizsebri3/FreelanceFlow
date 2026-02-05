/* ==========================================================================
   Validation Utilities
   Form validation helpers for production-ready forms
   ========================================================================== */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

// ==========================================================================
// Email Validation
// ==========================================================================

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// ==========================================================================
// Required Field Validation
// ==========================================================================

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

// ==========================================================================
// Number Validation
// ==========================================================================

export const validatePositiveNumber = (value: number, fieldName: string): ValidationResult => {
  if (isNaN(value) || value < 0) {
    return { isValid: false, message: `${fieldName} must be a positive number` };
  }
  return { isValid: true };
};

export const validatePercentage = (value: number): ValidationResult => {
  if (isNaN(value) || value < 0 || value > 100) {
    return { isValid: false, message: 'Progress must be between 0 and 100' };
  }
  return { isValid: true };
};

// ==========================================================================
// Date Validation
// ==========================================================================

export const validateFutureDate = (dateString: string): ValidationResult => {
  if (!dateString) {
    return { isValid: false, message: 'Date is required' };
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { isValid: false, message: 'Date cannot be in the past' };
  }

  return { isValid: true };
};

// ==========================================================================
// Phone Validation
// ==========================================================================

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: true }; // Phone is optional
  }

  // Basic phone regex - accepts various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

// ==========================================================================
// Name Validation
// ==========================================================================

export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 100) {
    return { isValid: false, message: `${fieldName} must be less than 100 characters` };
  }

  return { isValid: true };
};

// ==========================================================================
// Form Validation Helpers
// ==========================================================================

export const validateProjectForm = (data: {
  name: string;
  client: string;
  budget: number;
  deadline: string;
  progress: number;
}): FormErrors => {
  const errors: FormErrors = {};

  const nameValidation = validateName(data.name, 'Project name');
  if (!nameValidation.isValid) errors.name = nameValidation.message!;

  const clientValidation = validateRequired(data.client, 'Client');
  if (!clientValidation.isValid) errors.client = clientValidation.message!;

  const budgetValidation = validatePositiveNumber(data.budget, 'Budget');
  if (!budgetValidation.isValid) errors.budget = budgetValidation.message!;

  const deadlineValidation = validateFutureDate(data.deadline);
  if (!deadlineValidation.isValid) errors.deadline = deadlineValidation.message!;

  const progressValidation = validatePercentage(data.progress);
  if (!progressValidation.isValid) errors.progress = progressValidation.message!;

  return errors;
};

export const validateClientForm = (data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}): FormErrors => {
  const errors: FormErrors = {};

  const nameValidation = validateName(data.name, 'Full name');
  if (!nameValidation.isValid) errors.name = nameValidation.message!;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.message!;

  if (data.company) {
    const companyValidation = validateName(data.company, 'Company');
    if (!companyValidation.isValid) errors.company = companyValidation.message!;
  }

  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) errors.phone = phoneValidation.message!;
  }

  return errors;
};

// ==========================================================================
// Utility Functions
// ==========================================================================

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getErrorMessage = (errors: FormErrors, field: string): string => {
  return errors[field] || '';
};