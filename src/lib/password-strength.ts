// Password strength validation utility

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  hasMinLength: boolean;
  hasMaxLength: boolean;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const minLength = 8;
  const maxLength = 128;
  
  // Check basic requirements
  const hasMinLength = password.length >= minLength;
  const hasMaxLength = password.length <= maxLength;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>[\]\\;'`~_-]/.test(password);
  
  // Calculate score (0-100)
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring
  if (hasMinLength) {
    score += 20;
  } else {
    feedback.push(`Password must be at least ${minLength} characters`);
  }
  
  if (password.length > 12) score += 10;
  if (password.length > 16) score += 10;
  
  // Character diversity scoring
  if (hasLowerCase) score += 15;
  else feedback.push('Add lowercase letters');
  
  if (hasUpperCase) score += 15;
  else feedback.push('Add uppercase letters');
  
  if (hasNumbers) score += 15;
  else feedback.push('Add numbers');
  
  if (hasSymbols) score += 15;
  else feedback.push('Add special characters (!@#$%^&*(),.?":{}|<> etc.)');
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeated characters');
  }
  
  if (/123|abc|qwe|asd/.test(password.toLowerCase())) {
    score -= 10;
    feedback.push('Avoid sequential characters');
  }
  
  // Length penalty for too long
  if (!hasMaxLength) {
    score = Math.max(0, score - 20);
    feedback.push(`Password must be no more than ${maxLength} characters`);
  }
  
  // Determine strength level
  let strength: PasswordStrengthResult['strength'] = 'very-weak';
  if (score >= 80) strength = 'strong';
  else if (score >= 60) strength = 'good';
  else if (score >= 40) strength = 'fair';
  else if (score >= 20) strength = 'weak';
  
  const isValid = hasMinLength && hasMaxLength && hasLowerCase && hasUpperCase && hasNumbers && hasSymbols;
  
  return {
    isValid,
    score: Math.max(0, Math.min(100, score)),
    strength,
    feedback,
    hasMinLength,
    hasMaxLength,
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSymbols
  };
}

// Simplified password strength for UI display (returns score 0-5 and feedback string)
export function calculatePasswordStrength(password: string): { score: number; feedback: string } | null {
  if (!password || password.length === 0) return null;
  
  const result = validatePasswordStrength(password);
  
  // Convert 0-100 score to 0-5 scale
  const normalizedScore = Math.min(5, Math.floor(result.score / 20));
  
  // Get first feedback message or default
  let feedbackText = '';
  if (result.score >= 80) {
    feedbackText = 'Strong password';
  } else if (result.score >= 60) {
    feedbackText = 'Good password';
  } else if (result.score >= 40) {
    feedbackText = 'Fair password';
  } else if (result.score >= 20) {
    feedbackText = 'Weak password - ' + (result.feedback[0] || 'add more variety');
  } else {
    feedbackText = 'Very weak - ' + (result.feedback[0] || 'needs improvement');
  }
  
  return {
    score: normalizedScore,
    feedback: feedbackText
  };
}