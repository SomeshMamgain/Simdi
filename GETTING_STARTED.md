# SIMDI Pahadi - Getting Started Checklist

Use this checklist to set up and launch your SIMDI Pahadi e-commerce platform.

## Phase 1: Initial Setup

- [ ] **Clone/Download Project**
  - Project is ready at `/vercel/share/v0-project`
  - All core files are in place

- [ ] **Review Project Structure**
  - Read `README.md` for overview
  - Check `IMPLEMENTATION_GUIDE.md` for roadmap
  - Look at component structure in `components/`

- [ ] **Install Dependencies**
  ```bash
  npm install
  # or
  pnpm install
  ```

- [ ] **Start Development Server**
  ```bash
  npm run dev
  # or
  pnpm dev
  ```
  - Visit http://localhost:3000
  - Verify landing page loads correctly
  - Check navbar and footer render properly

## Phase 2: Appwrite Setup (Critical)

- [ ] **Create Appwrite Account**
  - Go to https://cloud.appwrite.io
  - Sign up and create organization
  - Create new project named "SIMDI"

- [ ] **Note Credentials**
  - [ ] Project ID
  - [ ] Endpoint URL (likely `https://cloud.appwrite.io/v1`)

- [ ] **Enable Authentication**
  - Go to Auth settings
  - Enable Email/Password authentication

- [ ] **Generate API Key**
  - Go to Settings → API Keys
  - Create new API key with name "SIMDI Server Key"
  - Give it all database permissions
  - [ ] Copy and save API key securely

- [ ] **Create Database**
  - Click "Create Database"
  - Name it "main"
  - Note Database ID (should be "main")

- [ ] **Create Collections** (Follow `APPWRITE_SETUP.md`)
  - [ ] Products collection
  - [ ] Categories collection
  - [ ] Orders collection
  - [ ] Blog Posts collection
  - [ ] Reviews collection
  - [ ] Users collection

- [ ] **Create Sample Data**
  - Add 2-3 sample products
  - Add 1-2 sample blog posts
  - Add sample categories

## Phase 3: Razorpay Setup (Optional for Testing)

- [ ] **Create Razorpay Account**
  - Go to https://razorpay.com
  - Sign up for business account
  - Complete KYC verification

- [ ] **Get API Keys**
  - Go to Account Settings → API Keys
  - [ ] Copy Key ID (public key)
  - [ ] Copy Key Secret (secret key)
  - Note: Use Test mode for development

## Phase 4: Environment Configuration

- [ ] **Create `.env.local` File**
  - Create file in project root
  - Add all required variables:
  ```
  NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
  NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
  APPWRITE_API_KEY=your_api_key
  RAZORPAY_KEY_ID=your_razorpay_key
  RAZORPAY_SECRET=your_razorpay_secret
  ```

- [ ] **Verify `.env.local` is in `.gitignore`**
  - Ensure file won't be committed to Git
  - Never share credentials publicly

- [ ] **Test Environment Variables**
  - Restart development server
  - Check browser console for errors
  - No connection errors should appear

## Phase 5: Testing

- [ ] **Landing Page**
  - [ ] Page loads without errors
  - [ ] Hero section displays correctly
  - [ ] Featured products section visible
  - [ ] Blog preview section visible
  - [ ] Navigation links work

- [ ] **Navigation**
  - [ ] All navbar links work
  - [ ] Cart icon visible
  - [ ] Mobile menu works on small screens
  - [ ] Account link works

- [ ] **Pages Load**
  - [ ] /products loads
  - [ ] /blog loads
  - [ ] /cart loads
  - [ ] /account loads
  - [ ] Footer visible on all pages

- [ ] **Appwrite Connection**
  - [ ] No console errors about Appwrite
  - [ ] Products page can fetch from Appwrite (once implemented)
  - [ ] No authentication errors

## Phase 6: Feature Implementation (Recommended Order)

### 1. Product Catalog
- [ ] Connect /products page to Appwrite
- [ ] Display products from database
- [ ] Add product filtering by category
- [ ] Create product detail page `/products/[slug]`
- [ ] Add product images
- [ ] Show product reviews

### 2. Shopping Cart
- [ ] Install Zustand: `npm install zustand`
- [ ] Create cart store in `/lib/store.ts`
- [ ] Implement add to cart functionality
- [ ] Update navbar cart count
- [ ] Create CartItem component
- [ ] Implement remove from cart
- [ ] Show cart totals

### 3. User Authentication
- [ ] Create auth service `/lib/auth.ts`
- [ ] Implement login form
- [ ] Implement register form
- [ ] Add session management
- [ ] Create protected routes
- [ ] Add logout functionality

### 4. Checkout & Payment
- [ ] Create checkout page
- [ ] Add shipping address form
- [ ] Integrate Razorpay
- [ ] Create payment button
- [ ] Handle payment verification
- [ ] Create order confirmation page

### 5. Blog Feature
- [ ] Install react-markdown: `npm install react-markdown`
- [ ] Create blog post detail page
- [ ] Render markdown content
- [ ] Add blog categories
- [ ] Create related posts section
- [ ] Add blog search functionality

### 6. Admin Dashboard
- [ ] Create protected admin routes
- [ ] Build product management interface
- [ ] Build order management interface
- [ ] Build blog management interface
- [ ] Add inventory tracking

## Phase 7: Deployment Preparation

- [ ] **Test Production Build**
  ```bash
  npm run build
  npm start
  ```

- [ ] **Add All Environment Variables**
  - Verify all required env vars are set
  - Test with production values (or staging)

- [ ] **Security Check**
  - [ ] No credentials in code
  - [ ] `.env.local` not committed
  - [ ] API keys properly restricted in Appwrite

- [ ] **SEO Check**
  - [ ] Metadata set in `layout.tsx`
  - [ ] Open Graph tags configured
  - [ ] Sitemap ready (add if needed)

- [ ] **Performance Check**
  - [ ] Images optimized
  - [ ] No console errors
  - [ ] Page load time acceptable

## Phase 8: Launch

- [ ] **Choose Hosting Platform**
  - [ ] Vercel (recommended for Next.js)
  - [ ] Other Node.js hosting

- [ ] **Deploy to Production**
  - [ ] Connect GitHub repository
  - [ ] Set environment variables in hosting platform
  - [ ] Trigger deployment
  - [ ] Test in production

- [ ] **Post-Launch**
  - [ ] Monitor error logs
  - [ ] Test payment flow with real Razorpay
  - [ ] Test user registration and login
  - [ ] Monitor Appwrite database

- [ ] **Razorpay Production Setup**
  - [ ] Switch from test to production mode
  - [ ] Update API keys in environment
  - [ ] Enable webhooks for payment verification
  - [ ] Test end-to-end payment flow

## Helpful Resources

- **Setup Guides**
  - `APPWRITE_SETUP.md` - Detailed Appwrite setup instructions
  - `IMPLEMENTATION_GUIDE.md` - Feature implementation roadmap
  - `README.md` - Project overview and structure

- **Documentation**
  - [Appwrite Docs](https://appwrite.io/docs) - Database and auth
  - [Razorpay Docs](https://razorpay.com/docs) - Payment integration
  - [Next.js Docs](https://nextjs.org/docs) - Framework
  - [Tailwind CSS](https://tailwindcss.com) - Styling

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| "Cannot find appwrite" | Run `npm install` to install dependencies |
| Appwrite connection error | Check `.env.local` variables are correct |
| Styling looks wrong | Clear `.next` folder and restart dev server |
| Products not loading | Verify Appwrite collections are created |
| Environment variables not loading | Restart dev server after creating `.env.local` |
| Build fails | Run `npm run type-check` to find TypeScript errors |

## Questions?

1. Check `README.md` for general information
2. Check `APPWRITE_SETUP.md` for Appwrite issues
3. Check `IMPLEMENTATION_GUIDE.md` for implementation questions
4. Review relevant documentation links above
5. Check component files for code comments

## Success Indicators

You'll know everything is working when:
- ✅ Landing page loads without errors
- ✅ Products page displays products from Appwrite
- ✅ You can add items to cart
- ✅ Login/signup works with Appwrite
- ✅ Products can be purchased with Razorpay
- ✅ Order confirmation shows correctly
- ✅ Blog posts display with proper formatting
- ✅ Admin dashboard works for managing content

---

**You're all set! Start with Phase 1 and work through systematically. The platform is designed to be implemented in manageable chunks. Happy coding! 🏔️**
