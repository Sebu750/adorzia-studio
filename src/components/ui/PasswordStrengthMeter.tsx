import React from 'react';
import { validatePasswordStrength, type PasswordStrengthResult } from '@/lib/password-strength';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password, 
  className = '' 
}) => {
  const strengthResult = validatePasswordStrength(password);
  
  const getStrengthColor = (strength: PasswordStrengthResult['strength']) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'good': return 'bg-green-400';
      case 'fair': return 'bg-yellow-500';
      case 'weak': return 'bg-orange-500';
      case 'very-weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthLabel = (strength: PasswordStrengthResult['strength']) => {
    switch (strength) {
      case 'strong': return 'Strong';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'weak': return 'Weak';
      case 'very-weak': return 'Very Weak';
      default: return 'Very Weak';
    }
  };

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Password Strength
        </span>
        <span className={`text-sm font-medium ${
          strengthResult.strength === 'strong' || strengthResult.strength === 'good' 
            ? 'text-green-600' 
            : strengthResult.strength === 'fair' 
            ? 'text-yellow-600' 
            : 'text-red-600'
        }`}>
          {getStrengthLabel(strengthResult.strength)}
        </span>
      </div>
      
      {/* Strength bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strengthResult.strength)}`}
          style={{ width: `${strengthResult.score}%` }}
        />
      </div>
      
      {/* Requirements checklist */}
      <div className="text-xs space-y-1">
        <div className="font-medium text-muted-foreground mb-1">Requirements:</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strengthResult.hasMinLength ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={strengthResult.hasMinLength ? 'text-green-700' : 'text-red-700'}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strengthResult.hasLowerCase ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={strengthResult.hasLowerCase ? 'text-green-700' : 'text-red-700'}>
              Lowercase letter
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strengthResult.hasUpperCase ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={strengthResult.hasUpperCase ? 'text-green-700' : 'text-red-700'}>
              Uppercase letter
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strengthResult.hasNumbers ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={strengthResult.hasNumbers ? 'text-green-700' : 'text-red-700'}>
              Number
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${strengthResult.hasSymbols ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={strengthResult.hasSymbols ? 'text-green-700' : 'text-red-700'}>
              Special character
            </span>
          </div>
        </div>
      </div>

      {/* Feedback messages */}
      {strengthResult.feedback.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          <div className="font-medium mb-1">Suggestions:</div>
          <ul className="list-disc list-inside space-y-1">
            {strengthResult.feedback.map((message, index) => (
              <li key={index} className="text-red-600">{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;