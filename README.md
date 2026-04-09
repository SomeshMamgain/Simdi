# SIMDI Pahadi - Authentic Himalayan E-Commerce Platform

Welcome to SIMDI Pahadi! This is a full-featured e-commerce platform built with Next.js, Appwrite, and Razorpay, designed to showcase and sell authentic handcrafted products from the Himalayan regions.

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm or pnpm
- Appwrite account (cloud or self-hosted)
- Razorpay account (for payments)

### 2. Setup Appwrite & Razorpay
Follow the detailed guide in `APPWRITE_SETUP.md` to:
- Create Appwrite project and collections
- Generate API keys
- Create Razorpay account

### 3. Environment Variables
Create `.env.local` in the project root:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID=your_orders_collection_id
APPWRITE_API_KEY=your_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
ZOHO_MAIL_USER=orders@simdi.in
ZOHO_MAIL_PASSWORD=your_zoho_app_password
ZOHO_MAIL_HOST=smtp.zoho.in
ZOHO_MAIL_PORT=587
TEAM_EMAIL_1=team@simdi.in
TEAM_EMAIL_2=yogeshmamgain2611@gmail.com
APP_NAME=SIMDI
APP_SUPPORT_EMAIL=support@simdi.in
APP_LOGO_URL=https://your-domain/logo.png
```

### 4. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 5. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts & metadata
│   ├── globals.css              # Global styles & Pahadi color palette
│   ├── page.tsx                 # Landing page (COMPLETE)
│   ├── products/                # Product catalog
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/             # Product detail (ready to implement)
│   ├── blog/                    # Blog features
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/             # Blog post detail
│   ├── cart/                    # Shopping cart
│   ├── checkout/                # Checkout & payment (ready to implement)
│   ├── account/                 # Authentication & user profile
│   └── api/                     # API routes (ready to implement)
│
├── components/
│   ├── navbar.tsx               # Navigation component
│   ├── footer.tsx               # Footer component
│   └── ui/                      # shadcn/ui components
│
├── lib/
│   ├── appwrite.ts              # Appwrite SDK configuration
│   ├── api.ts                   # Database query functions
│   ├── utils.ts                 # Tailwind utilities (cn function)
│   └── store.ts                 # Zustand state management (ready)
│
├── public/
│   └── logo.png                 # SIMDI Pahadi logo
│
├── APPWRITE_SETUP.md            # Complete Appwrite setup guide
├── IMPLEMENTATION_GUIDE.md      # Implementation roadmap
└── README.md                    # This file
```

## Features Overview

### Current Features
- Responsive design with mobile-first approach
- Beautiful Pahadi-inspired UI with earthy color palette
- Navigation bar with cart icon and account links
- Landing page with hero section and featured products
- Product listing page (connected to Appwrite)
- Blog page (connected to Appwrite)
- Shopping cart page (ready for state management)
- Authentication page (ready for Appwrite Auth)
- Footer with links and social media

### In Development
- Product detail pages with reviews
- User authentication (signup/login)
- Shopping cart with Zustand
- Checkout process
- Razorpay payment integration
- Order history
- Blog post rendering with markdown
- Admin dashboard

### Planned Features
- Email notifications
- Wishlist functionality
- Advanced product search and filters
- Customer reviews and ratings
- Admin analytics
- Inventory management

## Design System

### Color Palette
The site uses an earthy, Pahadi-inspired color scheme:
- **Primary (Brown)**: `oklch(0.42 0.08 35)` - Headings, primary buttons
- **Secondary (Sage Green)**: `oklch(0.55 0.09 155)` - Secondary actions
- **Accent (Gold)**: `oklch(0.65 0.12 45)` - Highlights and CTAs
- **Background (Cream)**: `oklch(0.97 0.01 90)` - Page background
- **Foreground (Dark Brown)**: `oklch(0.22 0.02 35)` - Text color

### Typography
- **Headings**: Merriweather (serif) - Elegant, traditional
- **Body**: Open Sans (sans-serif) - Clean, readable

### Layout Approach
- Flexbox-first for layouts
- Mobile-first responsive design
- Max-width container (7xl = 80rem)
- Consistent spacing using Tailwind scale

## Key Files

### Entry Points
- `app/layout.tsx` - Root layout with font configuration
- `app/page.tsx` - Landing page (fully implemented)
- `app/globals.css` - Global styles and color tokens

### Components
- `components/navbar.tsx` - Responsive navigation
- `components/footer.tsx` - Site footer
- `components/ui/*` - shadcn/ui component library

### Backend Integration
- `lib/appwrite.ts` - Appwrite client and collection IDs
- `lib/api.ts` - Database query functions
- `APPWRITE_SETUP.md` - Setup instructions

### Configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration (using @theme)

## Database Schema

### Collections (in Appwrite)

1. **products**
   - id, name, description, category, price, stock, image_url, rating, reviews_count, created_at

2. **categories**
   - id, name, description, image_url

3. **orders**
   - id, user_id, items (JSON), total, status, razorpay_order_id, razorpay_payment_id, shipping_address, created_at

4. **blog_posts**
   - id, title, slug, content, excerpt, featured_image, author, category, published, created_at, updated_at

5. **reviews**
   - id, product_id, user_id, rating, comment, created_at

6. **users**
   - user_id, name, email, phone, addresses (JSON), preferences (JSON), created_at

See `APPWRITE_SETUP.md` for detailed collection creation instructions.

## API Utilities

All database queries are available in `lib/api.ts`:

```typescript
// Products
getProducts(limit, offset)
getProductById(id)
getProductsByCategory(category)
searchProducts(searchTerm)

// Blog
getBlogPosts(limit, offset)
getBlogPostBySlug(slug)

// Categories
getCategories()

// Orders
getOrderById(id)
getUserOrders(userId)

// Reviews
getProductReviews(productId)

// Users
getUserProfile(userId)
```

## Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT    # Appwrite endpoint URL
NEXT_PUBLIC_APPWRITE_PROJECT_ID  # Appwrite project ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID # Appwrite database ID
NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID # Orders collection ID
APPWRITE_API_KEY                 # Server-side Appwrite API key
RAZORPAY_KEY_ID                  # Razorpay public key
RAZORPAY_SECRET                  # Razorpay secret key
ZOHO_MAIL_USER                  # Zoho SMTP sender
ZOHO_MAIL_PASSWORD              # Zoho SMTP app password
ZOHO_MAIL_HOST                  # Zoho SMTP host
ZOHO_MAIL_PORT                  # Zoho SMTP port
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Set environment variables in platform settings

## Development Workflow

### Adding a New Page
1. Create folder in `app/` directory
2. Create `page.tsx` file
3. Import Navbar and Footer components
4. Build your page content

### Adding a New Component
1. Create file in `components/` directory
2. Use shadcn/ui components as base
3. Apply Pahadi colors and styling
4. Export and use in pages

### Connecting to Appwrite
1. Import queries from `lib/api.ts`
2. Use `useEffect` or `useCallback` for data fetching
3. Handle loading and error states
4. Update UI with fetched data

### Styling
- Use Tailwind CSS classes
- Reference colors via design tokens: `text-primary`, `bg-secondary`, `border-border`
- Prefer Tailwind scale values: `p-4`, `gap-6`, `text-lg`
- Use semantic classes for accessibility: `sr-only` for screen readers

## Common Tasks

### Change Color Scheme
Edit `app/globals.css` - Update CSS variables in `:root` and `.dark` sections.

### Update Logo
Replace `/public/logo.png` with new image (recommended size: 200x200px or larger).

### Add Navigation Links
Edit `components/navbar.tsx` - Add new `Link` components in the navigation sections.

### Update Metadata
Edit `app/layout.tsx` - Modify `metadata` object for SEO.

## Troubleshooting

### Build Errors
1. Clear cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run type-check`

### Appwrite Connection Issues
- Verify endpoint URL matches your Appwrite setup
- Check Project ID is correct
- Ensure API key has necessary permissions
- Check `.env.local` is properly formatted

### Styling Issues
- Clear browser cache
- Ensure `globals.css` is imported in `layout.tsx`
- Check Tailwind configuration is correct
- Verify font classes are applied to `html` element

### Payment Integration
- Use Razorpay test mode credentials during development
- Verify webhook endpoints are configured
- Check payment status updates in Appwrite orders

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Razorpay Documentation](https://razorpay.com/docs)

## Support & Contact

For issues or questions:
1. Check `APPWRITE_SETUP.md` for setup help
2. Review `IMPLEMENTATION_GUIDE.md` for implementation roadmap
3. Check the code comments and documentation
4. Visit the respective documentation sites

## License

This project is built with love for the Himalayan artisan community.

## Next Steps

1. Complete Appwrite setup (see `APPWRITE_SETUP.md`)
2. Add environment variables
3. Install dependencies
4. Run development server
5. Test the landing page
6. Start implementing features in this order:
   - Connect products page to Appwrite
   - Create Zustand cart store
   - Implement user authentication
   - Build checkout flow
   - Add blog functionality

Happy coding! Together, let's bring authentic Pahadi heritage to the world. 🏔️
