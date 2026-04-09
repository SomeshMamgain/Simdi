# Auth & Address Checkout - Code Snippets

## 1. Type Definitions

```typescript
// types/auth.ts

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  phone: string;
  fullAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  savedForFutureOrders?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AddressFormErrors {
  fullName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
  clearError: () => void;
}
```

## 2. Auth Store (Zustand)

```typescript
// lib/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      currentUser: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await response.json();
          set({
            isLoggedIn: true,
            currentUser: data.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
          }

          const data = await response.json();
          set({
            isLoggedIn: true,
            currentUser: data.user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Signup failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          currentUser: null,
          error: null,
        });
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/session');
          if (response.ok) {
            const data = await response.json();
            set({
              isLoggedIn: data.isLoggedIn,
              currentUser: data.user || null,
            });
          }
        } catch (error) {
          console.error('Session check failed:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

## 3. Address Validation Utilities

```typescript
// lib/utils/addressValidation.ts

import { AddressFormData, AddressFormErrors } from '@/types/auth';

export const validatePhoneNumber = (phone: string): string | null => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 10) {
    return 'Phone number must be 10 digits';
  }

  const firstDigit = parseInt(cleaned[0]);
  if (firstDigit < 6 || firstDigit > 9) {
    return 'Phone number must start with 6, 7, 8, or 9';
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  const trimmed = name.trim();

  if (trimmed.length < 3) {
    return 'Name must be at least 3 characters';
  }

  if (/\d/.test(trimmed)) {
    return 'Name cannot contain numbers';
  }

  return null;
};

export const validateAddressLine = (address: string): string | null => {
  const trimmed = address.trim();

  if (trimmed.length < 5) {
    return 'Address must be at least 5 characters';
  }

  return null;
};

export const validateCity = (city: string): string | null => {
  const trimmed = city.trim();

  if (trimmed.length < 2) {
    return 'City must be at least 2 characters';
  }

  return null;
};

export const validatePostalCode = (code: string): string | null => {
  const cleaned = code.replace(/\D/g, '');

  if (cleaned.length !== 6) {
    return 'Postal code must be exactly 6 digits';
  }

  return null;
};

export const validateState = (state: string): string | null => {
  if (!state || state.trim() === '') {
    return 'Please select a state';
  }

  return null;
};

export const validateAddressForm = (
  data: AddressFormData
): AddressFormErrors => {
  const errors: AddressFormErrors = {};

  const nameError = validateFullName(data.fullName);
  if (nameError) errors.fullName = nameError;

  const phoneError = validatePhoneNumber(data.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const addressError = validateAddressLine(data.addressLine1);
  if (addressError) errors.addressLine1 = addressError;

  const cityError = validateCity(data.city);
  if (cityError) errors.city = cityError;

  const postalError = validatePostalCode(data.postalCode);
  if (postalError) errors.postalCode = postalError;

  const stateError = validateState(data.state);
  if (stateError) errors.state = stateError;

  return errors;
};

export const hasErrors = (errors: AddressFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
```

## 4. Auth Modal Component

```typescript
// components/Modals/AuthModal.tsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { error, clearError } = useAuthStore();

  if (!isOpen) return null;

  const handleAuthSuccess = () => {
    clearError();
    onAuthSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {activeTab === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('login');
              clearError();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              clearError();
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form Content */}
        {activeTab === 'login' ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
};
```

## 5. Login Form Component

```typescript
// components/Modals/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      onSuccess();
    } catch (error: any) {
      setLocalError(error.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      {localError && (
        <p className="text-red-600 text-sm">{localError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## 6. Signup Form Component

```typescript
// components/Modals/SignupForm.tsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

interface SignupFormProps {
  onSuccess: () => void;
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  return null;
};

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !name || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, name);
      onSuccess();
    } catch (error: any) {
      setLocalError(error.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-600 mt-1">
          Min 8 chars, 1 uppercase, 1 number, 1 lowercase
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      {localError && (
        <p className="text-red-600 text-sm">{localError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !email || !name || !password || !confirmPassword}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};
```

## 7. Phone Input Component

```typescript
// components/Forms/PhoneInput.tsx

'use client';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits and limit to 10
    const digits = input.replace(/\D/g, '').slice(0, 10);
    onChange(digits);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Phone Number</label>
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="9999999999"
          maxLength={10}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={disabled}
        />
        {value && value.length === 10 && !error && (
          <span className="absolute right-3 top-2.5 text-green-600">✓</span>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {!error && (
        <p className="text-gray-600 text-xs mt-1">10 digits, starts with 6-9</p>
      )}
    </div>
  );
};
```

## 8. Address Collection Modal

```typescript
// components/Modals/AddressCollectionModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { AddressForm } from '@/components/Forms/AddressForm';
import { AddressFormData, UserProfile } from '@/types/auth';

interface AddressCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSaved: (address: AddressFormData) => void;
  savedAddress?: UserProfile['fullAddress'];
}

export const AddressCollectionModal: React.FC<AddressCollectionModalProps> = ({
  isOpen,
  onClose,
  onAddressSaved,
  savedAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Delivery Address</h2>
          <p className="text-gray-600">
            Where should we deliver your order?
          </p>
        </div>

        {/* Form */}
        <AddressForm
          onSubmit={onAddressSaved}
          onCancel={onClose}
          initialData={savedAddress}
        />
      </div>
    </div>
  );
};
```

## 9. Address Form Component

```typescript
// components/Forms/AddressForm.tsx

'use client';

import { useState } from 'react';
import { AddressFormData, AddressFormErrors } from '@/types/auth';
import { validateAddressForm } from '@/lib/utils/addressValidation';
import { PhoneInput } from './PhoneInput';
import { INDIAN_STATES } from '@/lib/constants/states';

interface AddressFormProps {
  onSubmit: (address: AddressFormData) => void;
  onCancel: () => void;
  initialData?: AddressFormData;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<AddressFormData>(
    initialData || {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    }
  );

  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(false);

  const handleChange = (
    field: keyof AddressFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateAddressForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Save to Appwrite here if needed
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      onSubmit(formData);
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <PhoneInput
          value={formData.phoneNumber}
          onChange={(value) => handleChange('phoneNumber', value)}
          error={errors.phoneNumber}
          disabled={isLoading}
        />
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Address Line 1
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          placeholder="123 Main Street"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.addressLine1
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        {errors.addressLine1 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          placeholder="Apartment, suite, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Mumbai"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.city
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <select
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.state
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium mb-2">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) =>
              handleChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="400001"
            maxLength={6}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.postalCode
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
          />
          {errors.postalCode && (
            <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <input
            type="text"
            value={formData.country}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>
      </div>

      {/* Save for Future Orders */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={saveForFuture}
          onChange={(e) => setSaveForFuture(e.target.checked)}
          className="w-4 h-4"
          disabled={isLoading}
        />
        <span className="text-sm text-gray-700">
          Save this address for future orders
        </span>
      </label>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
};
```

## 10. Constants - Indian States

```typescript
// lib/constants/states.ts

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];
```

## 11. Updated Checkout Button

```typescript
// components/Cart/CheckoutButton.tsx (Updated)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { AuthModal } from '@/components/Modals/AuthModal';
import { AddressCollectionModal } from '@/components/Modals/AddressCollectionModal';
import { AddressFormData } from '@/types/auth';

export const CheckoutButton: React.FC = () => {
  const router = useRouter();
  const { items, getTotal } = useCartStore((state) => ({
    items: state.items,
    getTotal: state.getTotal,
  }));

  const { isLoggedIn } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressFormData | null>(null);

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setShowAddressModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowAddressModal(true);
  };

  const handleAddressSaved = async (address: AddressFormData) => {
    setSelectedAddress(address);
    setShowAddressModal(false);

    // Proceed with Razorpay payment
    // ... existing Razorpay code ...
    router.push(`/checkout?address=${encodeURIComponent(JSON.stringify(address))}`);
  };

  return (
    <>
      <button
        onClick={handleCheckoutClick}
        disabled={items.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        Proceed to Checkout
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <AddressCollectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressSaved={handleAddressSaved}
      />
    </>
  );
};
```

## 12. API: Login Endpoint

```typescript
// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use Appwrite SDK to authenticate
    const user = await account.createEmailPasswordSession(email, password);

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: email,
        name: email.split('@')[0], // Can be updated later
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }
}
```

## 13. API: Signup Endpoint

```typescript
// app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create user account
    const user = await account.create(ID.unique(), email, password, name);

    // Create session
    await account.createEmailPasswordSession(email, password);

    return NextResponse.json({
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.message.includes('already registered')) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Signup failed. Please try again.' },
      { status: 500 }
    );
  }
}
```

## 14. API: Check Session Endpoint

```typescript
// app/api/auth/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

export async function GET(request: NextRequest) {
  try {
    const user = await account.get();

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return NextResponse.json({
      isLoggedIn: false,
      user: null,
    });
  }
}
```

---

These snippets cover all the essential functionality needed for the auth check and address collection before checkout!
