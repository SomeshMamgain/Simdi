# Checkout Flow with Auth, Address & Phone Validation - Claude Code Prompt

## Context
I have a fully functional shopping cart system with promo codes, handling charges, and Razorpay integration ready. Now I need to add a multi-step checkout flow that:
1. Checks if user is logged in when clicking "Proceed to Checkout"
2. If not logged in → Open authentication modal
3. If logged in → Open address collection modal
4. Collect delivery address, phone number, and optional user details
5. Validate address and phone
6. Only after all details are filled → Proceed with Razorpay payment

## Current Setup
- Cart system with Zustand store
- Razorpay payment integration ready
- Appwrite backend
- Next.js with TypeScript
- Already have user authentication system (AppWrite Auth)

## Requirements Overview

### 1. Authentication State Management
- Create a Zustand auth store (separate from cart store) or extend existing if available
- Track:
  * `isLoggedIn`: boolean (check if user session exists)
  * `currentUser`: User object (id, email, name, phone, address)
  * `login`: function to authenticate user
  * `logout`: function
  * `updateUserProfile`: function to update address, phone, etc
- Check localStorage/AppWrite session on app load to restore logged-in state
- Persist user data across page refreshes

### 2. Authentication Modal
- Display when user clicks checkout and is NOT logged in
- Modal content should include:
  * **Login Tab**: Email/password login form
  * **Sign Up Tab**: Email, password, confirm password, name fields
  * Close button (X)
- Form validation:
  * Email format validation
  * Password strength requirements (min 8 chars, at least 1 uppercase, 1 number)
  * Confirm password match
  * Name not empty
- API calls:
  * POST /api/auth/login - Send email & password to Appwrite
  * POST /api/auth/signup - Create new user in Appwrite
  * Verify session is created on success
- On successful auth:
  * Close auth modal automatically
  * Update auth store with user data
  * Open address collection modal (next step)
- Error handling:
  * Show specific error messages (Invalid credentials, Email already exists, etc.)
  * Allow retry without closing modal

### 3. Address Collection Modal
- Display ONLY after user is logged in
- Modal content:
  * Header: "Delivery Address"
  * Form fields:
    - Full Name (pre-filled from user profile if available)
    - Phone Number (10 digits for India, starting with 6-9)
    - Address Line 1 (street address)
    - Address Line 2 (optional - apartment, suite, etc.)
    - City
    - State (dropdown with Indian states)
    - Postal Code (6 digits for India)
    - Country (default: India, can be read-only)
  * Two buttons:
    - "Save & Continue" (validates all required fields)
    - "Cancel" (goes back to cart)
  * Optional: Checkbox for "Save this address for future orders"

### 4. Address Validation
Before allowing "Save & Continue":
- Phone number:
  * Must be exactly 10 digits
  * Must start with 6, 7, 8, or 9
  * No spaces or special characters
  * Show error: "Please enter a valid 10-digit phone number"
- Full Name:
  * Min 3 characters
  * No numbers
  * Show error: "Please enter a valid name"
- Address Line 1:
  * Min 5 characters
  * Show error: "Please enter a complete address"
- City:
  * Min 2 characters
  * Show error: "Please enter a valid city"
- Postal Code:
  * Exactly 6 digits for India
  * Show error: "Postal code must be 6 digits"
- State:
  * Must be selected
  * Show error: "Please select a state"
- All validations show in real-time as user types (optional)

### 5. User Profile Persistence
- Save address to Appwrite database in User collection:
  ```
  {
    userId: string (unique identifier)
    email: string
    name: string
    phone: string
    fullAddress: {
      fullName: string
      phoneNumber: string
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    createdAt: timestamp
    updatedAt: timestamp
  }
  ```
- Option to save address for future orders (checkbox)
- Auto-fill form on next checkout if user has saved address

### 6. Complete Checkout Flow (Updated)

**Step 1: User clicks "Proceed to Checkout"**
- Check if user is logged in (check auth store/localStorage)

**Step 2A: If NOT logged in**
- Open Auth Modal
- User completes login/signup
- Auth store updates
- Close auth modal
- Automatically proceed to Step 2B

**Step 2B: If logged in (or after successful auth)**
- Open Address Collection Modal
- If user has saved address → Pre-fill form with saved address
- User enters/confirms address and phone

**Step 3: Validate address & phone**
- Show validation errors if any field is invalid
- Disable "Save & Continue" button if validation fails
- Show green checkmark on validated fields (optional UX enhancement)

**Step 4: Save address to Appwrite**
- On successful validation, click "Save & Continue"
- Save to user profile in Appwrite
- Close address modal

**Step 5: Proceed to Razorpay**
- All checks passed, user logged in, address collected
- Fetch latest user data from Appwrite (including address)
- Create Razorpay order with user details (name, email, phone, delivery address)
- Open Razorpay payment modal

**Step 6: Payment & Order Creation**
- User completes Razorpay payment
- Verify signature
- Create order record in Appwrite with:
  * Cart items
  * User ID
  * Delivery address
  * Phone number
  * Payment details
  * Order total
  * Timestamps
- Clear cart from store
- Clear address from temp storage
- Redirect to order confirmation page

### 7. Components Required

```
├── components/
│   ├── Modals/
│   │   ├── AuthModal.tsx              // Login/Signup modal
│   │   ├── AddressCollectionModal.tsx // Address form modal
│   │   └── useCheckoutFlow.ts         // Custom hook managing flow
│   │
│   ├── Forms/
│   │   ├── LoginForm.tsx              // Email/password login
│   │   ├── SignupForm.tsx             // New user registration
│   │   ├── AddressForm.tsx            // Address form with validation
│   │   └── PhoneInput.tsx             // Special phone number input
│   │
│   └── Cart/
│       └── CheckoutButton.tsx         // Updated with new flow
│
├── lib/
│   ├── store/
│   │   ├── authStore.ts               // Auth state management (Zustand)
│   │   └── checkoutStore.ts           // Checkout flow state (optional)
│   │
│   └── services/
│       ├── authService.ts             // Login/signup/logout
│       ├── userService.ts             // Fetch/update user profile
│       ├── addressService.ts          // Save/fetch addresses
│       └── paymentService.ts          // Razorpay (existing)
│
├── types/
│   ├── auth.ts                        // Auth types
│   ├── user.ts                        // User profile types
│   └── address.ts                     // Address types
│
└── app/api/
    ├── auth/
    │   ├── login/route.ts             // POST login
    │   ├── signup/route.ts            // POST signup
    │   └── logout/route.ts            // POST logout
    │
    └── user/
        └── profile/route.ts           // GET/PUT user profile
```

### 8. Type Definitions Required

```typescript
// Auth Types
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
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

// Checkout State
interface CheckoutState {
  isAuthModalOpen: boolean;
  isAddressModalOpen: boolean;
  currentStep: 'auth' | 'address' | 'payment' | 'complete';
  
  // Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  setCheckoutStep: (step: string) => void;
}

// Address Form Validation
interface AddressFormErrors {
  fullName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
```

### 9. Auth Store Structure (Zustand)

```typescript
interface AuthState {
  // State
  isLoggedIn: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>; // Check on app load
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  clearError: () => void;
  
  // Getters
  getUser: () => User | null;
  getIsLoggedIn: () => boolean;
}
```

### 10. Checkout Modal Flow Sequence

```
User Clicks "Proceed to Checkout"
         ↓
Is User Logged In?
    ↙                  ↖
   NO                  YES
   ↓                   ↓
Show Auth Modal → User logs in/signs up → Success → Close Auth Modal
   ↓
   └─────────────────────────────────────┘
                    ↓
            Show Address Modal
                    ↓
         User enters address & phone
                    ↓
        Validate all required fields
    ↙                           ↖
NO (Errors)                     YES (Valid)
↓                                ↓
Show errors,                  Save to Appwrite
re-enable form         Close Address Modal
↑                              ↓
└──────────────────────────────┘
                                ↓
                      Ready for Razorpay
                                ↓
                  Create Razorpay Order
                                ↓
                  Open Payment Modal
                                ↓
                    Payment Success?
                    ↙              ↖
                   NO              YES
                   ↓                ↓
            Show Error        Create Order Record
            Allow Retry       Clear Cart
                              Redirect to Confirmation
```

### 11. Indian States Dropdown
Must include all 28 states and 8 union territories:

```typescript
const INDIAN_STATES = [
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
  "Jammu and Kashmir"
];
```

### 12. API Endpoints Required

```
1. POST /api/auth/login
   Request: { email: string, password: string }
   Response: { success: boolean, user: User, token: string }

2. POST /api/auth/signup
   Request: { email: string, password: string, name: string }
   Response: { success: boolean, user: User, token: string }

3. POST /api/auth/logout
   Response: { success: boolean }

4. GET /api/auth/session
   Response: { isLoggedIn: boolean, user: User | null }

5. GET /api/user/profile
   Response: { user: User, profile: UserProfile }

6. PUT /api/user/profile
   Request: { profile: UserProfile, saveForFuture: boolean }
   Response: { success: boolean, profile: UserProfile }

7. POST /api/orders/create
   Request: { items, total, userProfile, address, paymentId, signature }
   Response: { orderId: string, status: string }
```

### 13. Modal UI/UX Requirements

**Auth Modal:**
- Header with title "Login" or "Sign Up"
- Tab buttons to switch between Login and Sign Up
- Clean form fields with placeholders
- "Forgot Password?" link (optional)
- Social login buttons (optional)
- Loading spinner during auth request
- Error message display area
- Close button (X) in top-right

**Address Modal:**
- Header: "Delivery Address"
- Subtitle: "Where should we deliver your order?"
- Form fields with clear labels
- Phone number input with format guide (10 digits)
- State dropdown with search/filter capability
- Real-time validation indicators (green checkmark for valid fields)
- Error messages below each field
- Bottom buttons: "Save & Continue" and "Cancel"
- Loading state while saving to Appwrite

### 14. Mobile Responsiveness
- Auth Modal:
  * Full screen on mobile (or 100% width with small margins)
  * Stacked form fields
  * Large touch-friendly buttons
  * Keyboard-friendly (proper input types, auto-focus)

- Address Modal:
  * Full screen or slide-up modal on mobile
  * Scrollable content
  * Sticky button bar at bottom
  * Large input fields for easy typing

### 15. Password Validation Rules
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 lowercase letter (a-z)
- Show password strength indicator during signup:
  * Weak: only 1-2 criteria met
  * Fair: 3 criteria met
  * Strong: all 4 criteria met

### 16. Error Handling & Edge Cases

**Auth Errors:**
- "Invalid email or password" (generic for security)
- "Email already registered"
- "Email format is invalid"
- "Password is too weak"
- "Passwords do not match"
- "Network error. Please try again"
- "Session expired. Please login again"

**Address Errors:**
- "Phone number must be 10 digits"
- "Please enter a valid name"
- "Address is too short"
- "Postal code must be 6 digits"
- "Please select a valid state"
- "Failed to save address. Please try again"

**Network/API Errors:**
- Retry button
- Show error message
- Keep modal open
- Allow user to modify and retry

### 17. Security Considerations
- **Passwords**: Never log or store plaintext passwords
- **Phone**: Validate format but don't expose in URLs
- **Address**: Encrypt when storing in database
- **Session**: Use secure cookies/tokens from Appwrite
- **CORS**: Only allow requests from your domain
- **Rate Limiting**: Limit login attempts (5 attempts per hour)
- **Validation**: Validate on both frontend and backend

### 18. Optional Enhancements
1. Remember user email on login form (checkbox)
2. "Forgot Password" flow
3. Phone number verification via OTP
4. Multiple saved addresses (show list, allow edit/delete)
5. Address autocomplete (Google Maps API integration)
6. Express checkout (1-click if address already saved)
7. Email confirmation after order
8. Order summary before payment confirmation

### 19. Testing Checklist

```
Authentication:
☐ Login with valid credentials
☐ Login with invalid credentials
☐ Signup with new email
☐ Signup with existing email
☐ Password validation works
☐ Passwords match validation works
☐ Session persists after page reload
☐ Logout clears auth state

Address Collection:
☐ Form pre-fills from saved address
☐ Phone number validation (10 digits)
☐ Phone number validation (must start with 6-9)
☐ Name validation (no numbers)
☐ Postal code validation (6 digits)
☐ All required fields show error if empty
☐ Address saves to Appwrite
☐ Save for future orders works

Checkout Flow:
☐ Unauthenticated user → Auth modal opens
☐ Authenticated user → Address modal opens
☐ After auth → Address modal opens automatically
☐ Clicking cancel → Returns to cart
☐ Invalid address → Shows errors, prevents checkout
☐ Valid address → Proceeds to Razorpay
☐ Mobile responsive layout
☐ Form validation real-time or on blur
```

### 20. Implementation Priority

1. **Phase 1**: Auth Store + AuthModal (Login/Signup)
2. **Phase 2**: Auth API endpoints (/api/auth/login, /api/auth/signup)
3. **Phase 3**: Address types and validation utilities
4. **Phase 4**: AddressCollectionModal component
5. **Phase 5**: User profile service and API endpoints
6. **Phase 6**: CheckoutButton flow orchestration
7. **Phase 7**: Integration with Razorpay (existing)
8. **Phase 8**: Order creation with address
9. **Phase 9**: Testing all flows
10. **Phase 10**: Polish UX, error messages, loading states

## Environment Variables Needed

```env
# Appwrite Auth
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id

# Backend Secrets (never expose)
APPWRITE_API_KEY=your_api_key
```

## Deliverables

✅ Complete Auth Store with session management
✅ Login/Signup modal with form validation
✅ Address collection modal with validation
✅ Phone number validation (10-digit Indian format)
✅ Address persistence to Appwrite
✅ Complete checkout flow orchestration
✅ Pre-fill form from saved address
✅ All API endpoints for auth and user management
✅ Error handling and user feedback
✅ Mobile responsive design
✅ Loading states during API calls
✅ Session restoration on page reload
✅ Integration with Razorpay payment flow
✅ Order creation with user address
✅ TypeScript type safety throughout
