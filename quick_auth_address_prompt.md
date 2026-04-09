# QUICK PROMPT - Auth Check & Address Collection Before Checkout

Copy and paste this into Claude Code:

---

I need to add a multi-step checkout flow before Razorpay payment:

## COMPLETE FLOW:

User clicks "Proceed to Checkout"
    ↓
Check if logged in
    ├─ NO → Show Auth Modal
    │        ├─ Login tab (email/password)
    │        └─ Sign Up tab (email/password/name)
    │        On success → Close modal
    │
    └─ YES → Continue
    
    ↓
Show Address Collection Modal
    ├─ Pre-fill with saved address if exists
    ├─ Form fields:
    │  ├─ Full Name (3+ chars)
    │  ├─ Phone (10 digits, must start with 6-9)
    │  ├─ Address Line 1 (5+ chars)
    │  ├─ Address Line 2 (optional)
    │  ├─ City (2+ chars)
    │  ├─ State (dropdown - all Indian states)
    │  ├─ Postal Code (exactly 6 digits)
    │  └─ Country (India, read-only)
    ├─ Validate all fields
    ├─ Checkbox: "Save for future orders"
    └─ Buttons: "Save & Continue" and "Cancel"

    ↓
Save address to Appwrite user profile
    ↓
Proceed to Razorpay payment (existing flow)

## REQUIRED COMPONENTS:

1. **Auth Store (Zustand)**
   - State: isLoggedIn, currentUser, isLoading, error
   - Methods: login(), signup(), logout(), checkSession()
   - Persist to localStorage
   - Restore session on app load

2. **Auth Modal Component**
   - Two tabs: Login & Sign Up
   - Login form: email, password input
   - Sign Up form: email, password, confirm password, name inputs
   - Form validation inline
   - Show errors below each field
   - Loading spinner during auth request
   - Close button (X)
   - On success → Auto-close → Open address modal

3. **Login/Sign Up Forms**
   - Email validation (valid email format)
   - Password strength (8+ chars, 1 uppercase, 1 number, 1 lowercase)
   - Confirm password match
   - Show real-time validation indicators
   - Submit button disabled until form is valid

4. **Address Collection Modal**
   - Title: "Delivery Address"
   - Form with fields: fullName, phoneNumber, addressLine1, addressLine2, city, state, postalCode
   - State dropdown with all 28 Indian states + 8 union territories
   - Phone number input with format: "10 digits, start with 6-9"
   - Real-time validation:
     * Phone: Must be 10 digits, start with 6-9
     * Name: 3+ chars, no numbers
     * Address: 5+ chars
     * City: 2+ chars
     * Postal: Exactly 6 digits
     * State: Must be selected
   - Show error messages for invalid fields
   - Disable "Save & Continue" until all required fields are valid
   - Buttons: "Save & Continue", "Cancel"
   - Loading spinner while saving

5. **Phone Input Component**
   - Only accept digits 0-9
   - Max length: 10 characters
   - Show format example: "9999999999"
   - Real-time validation feedback

6. **Address Form Validation**
   - Validate on blur or real-time
   - Show green checkmark for valid fields (optional)
   - Show red error for invalid fields
   - Disable submit button if any required field is invalid

## REQUIRED API ENDPOINTS:

1. **POST /api/auth/login**
   - Body: { email, password }
   - Return: { success, user, token }

2. **POST /api/auth/signup**
   - Body: { email, password, name }
   - Return: { success, user, token }

3. **GET /api/auth/session**
   - Return: { isLoggedIn, user }
   - Call this on app load to restore session

4. **GET /api/user/profile**
   - Return: { user, profile (with address) }

5. **PUT /api/user/profile**
   - Body: { profile, saveForFuture }
   - Return: { success, profile }

## REQUIRED TYPES:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
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

## UPDATED CHECKOUT BUTTON FLOW:

When user clicks "Proceed to Checkout":
1. Check if isLoggedIn from auth store
2. If NO → Open AuthModal
3. Wait for auth completion
4. On auth success → Close AuthModal
5. Automatically open AddressModal
6. Pre-fill with saved address if exists
7. User enters/confirms address
8. On "Save & Continue" → Validate fields → Save to Appwrite → Close modal
9. Proceed to Razorpay payment (existing code)

## VALIDATION RULES:

Phone Number:
- Exactly 10 digits
- Must start with 6, 7, 8, or 9
- No spaces, dashes, or special characters
- Error: "Please enter a valid 10-digit phone number"

Full Name:
- Min 3 characters
- No numbers allowed
- Error: "Please enter a valid name (3+ characters, no numbers)"

Address Line 1:
- Min 5 characters
- Error: "Please enter a complete address"

City:
- Min 2 characters
- Error: "Please enter a valid city"

Postal Code:
- Exactly 6 digits
- Error: "Postal code must be 6 digits"

State:
- Must be selected from dropdown
- Error: "Please select a state"

## INDIAN STATES LIST:
Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal, Andaman and Nicobar Islands, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Lakshadweep, Delhi, Puducherry, Ladakh, Jammu and Kashmir

## PASSWORD STRENGTH:
- Min 8 characters
- At least 1 uppercase (A-Z)
- At least 1 number (0-9)
- At least 1 lowercase (a-z)
- Show strength indicator: Weak/Fair/Strong

## ERROR MESSAGES:

Auth:
- "Invalid email or password"
- "Email already registered"
- "Email is invalid"
- "Passwords do not match"
- "Password is too weak"
- "Network error, please try again"

Address:
- "Phone number must be 10 digits"
- "Name must be 3+ characters with no numbers"
- "Address must be 5+ characters"
- "City must be 2+ characters"
- "Postal code must be 6 digits"
- "Please select a state"
- "Failed to save address"

## MOBILE RESPONSIVE:
- Auth Modal: Full width on mobile, stacked form
- Address Modal: Full width or bottom-sheet style
- Touch-friendly large buttons
- Large input fields for easy typing

## OPTIONAL ENHANCEMENTS:
- Remember email checkbox on login
- OTP verification for phone
- Multiple saved addresses
- Address autocomplete (Google Maps)
- Express checkout if address saved

## INTEGRATION WITH EXISTING CART:
- Keep all existing cart, promo, handling charge logic
- Only add auth + address steps before Razorpay
- After address saved → Continue with existing Razorpay code
- When creating order → Include user address from Appwrite
- Clear saved address from temp storage after order success

Use TypeScript, Zustand for auth store, Tailwind CSS, mobile responsive, proper error handling, loading states, form validation.

---

## SHORT VERSION (If above is too long):

I need checkout to work like this:

1. **User clicks "Proceed to Checkout"**
   - Check if logged in
   - If NO → Show auth modal (login/signup tabs)
   - If YES → Show address modal

2. **Auth Modal**
   - Login tab: email, password
   - Sign Up tab: email, password, confirm password, name
   - Form validation inline
   - On success → Close modal

3. **Address Modal** (auto-opens after auth)
   - Fields: fullName, phone, addressLine1, addressLine2, city, state, postalCode
   - State dropdown with all Indian states
   - Phone validation: 10 digits, starts with 6-9
   - Other validations: name 3+ chars, address 5+ chars, postal 6 digits, city 2+ chars
   - Show errors for invalid fields
   - Pre-fill with saved address if exists
   - Save button saves to Appwrite, closes modal

4. **Then proceed with Razorpay** (existing code)

Create:
- Auth store (Zustand) - tracks isLoggedIn, currentUser
- Auth modal with login/signup forms
- Address modal with validation
- API endpoints: login, signup, session check, get/update user profile
- Phone input component (10 digits only)
- All validation rules as specified above

TypeScript, Tailwind CSS, mobile responsive, proper error handling.

---
