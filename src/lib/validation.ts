// Validation utilities for client-side input sanitization and validation

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially harmful characters
  return input
    .trim()
    .replace(/[<>"\''&]/g, '')
    .slice(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePositiveNumber = (value: number | null | undefined, fieldName: string): void => {
  if (value !== null && value !== undefined && value < 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
};

export const validatePercentage = (value: number | null | undefined, fieldName: string): void => {
  if (value !== null && value !== undefined && (value < 0 || value > 100)) {
    throw new Error(`${fieldName} must be between 0 and 100`);
  }
};

export const validateBarcode = (barcode: string): string => {
  if (!barcode) return '';
  
  // Remove non-alphanumeric characters
  const cleaned = barcode.replace(/[^a-zA-Z0-9]/g, '');
  
  // Validate length (typical barcodes are 8-14 digits)
  if (cleaned.length > 0 && (cleaned.length < 8 || cleaned.length > 14)) {
    throw new Error('Barcode must be between 8 and 14 characters');
  }
  
  return cleaned;
};

export const validateFileUpload = (file: File): void => {
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size cannot exceed 5MB');
  }
  
  // Validate file type (images only)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }
  
  // Validate filename
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  if (sanitizedName !== file.name) {
    throw new Error('Invalid characters in filename');
  }
};

export const sanitizeDisplayName = (name: string): string => {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[<>"\''&]/g, '')
    .slice(0, 100);
};

// Secure error message handler - don't expose sensitive information
export const getSecureErrorMessage = (error: any): string => {
  // Generic error messages for security
  const secureMessages: Record<string, string> = {
    'PGRST301': 'Access denied',
    'PGRST116': 'Invalid request',
    'auth/user-not-found': 'Invalid credentials',
    'auth/wrong-password': 'Invalid credentials',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  
  // Check for known error codes
  if (error?.code && secureMessages[error.code]) {
    return secureMessages[error.code];
  }
  
  // Check for validation errors (these are safe to show)
  if (error?.message?.includes('must be a positive number') || 
      error?.message?.includes('must be between') ||
      error?.message?.includes('cannot exceed') ||
      error?.message?.includes('Barcode must be')) {
    return error.message;
  }
  
  // Default secure message
  return 'An error occurred. Please try again.';
};