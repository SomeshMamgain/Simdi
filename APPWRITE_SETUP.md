# SIMDI Pahadi - Appwrite Setup Guide

This guide will help you set up Appwrite collections and environment variables for SIMDI Pahadi e-commerce platform.

## Step 1: Create Appwrite Account and Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) and create an account
2. Create a new project named "SIMDI"
3. Once created, note your:
   - **Project ID** - visible in project settings
   - **Endpoint** - usually `https://cloud.appwrite.io/v1` (or your self-hosted URL)

## Step 2: Generate API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "SIMDI Server Key"
4. Give it all permissions (or at minimum: database.read, database.write, users.read, users.write)
5. Copy and save this key securely

## Step 3: Enable Authentication

1. Go to **Auth** settings
2. Enable **Email/Password** authentication
3. Configure email templates if needed

## Step 4: Create Database Collections

In Appwrite Console, go to **Databases** → **Create Database** → Name it "main"

### Collection 1: Products
```
Database: main
Collection ID: products
Attributes:
- id (String, Required, Encrypted)
- name (String, Required)
- description (String, Required)
- category (String, Required) - Enum: tea, honey, dried_fruits, spices, handicrafts
- price (Integer, Required)
- stock (Integer, Required)
- image_url (String, Required)
- rating (Float, Default: 0)
- reviews_count (Integer, Default: 0)
- created_at (DateTime, Required)
```

### Collection 2: Categories
```
Database: main
Collection ID: categories
Attributes:
- id (String, Required)
- name (String, Required)
- description (String)
- image_url (String)
```

### Collection 3: Orders
```
Database: main
Collection ID: orders
Attributes:
- id (String, Required)
- user_id (String, Required)
- items (JSON, Required)
- total (Integer, Required)
- status (String, Required) - Enum: pending, completed, failed
- razorpay_order_id (String)
- razorpay_payment_id (String)
- shipping_address (JSON, Required)
- created_at (DateTime, Required)
```

### Collection 4: Blog Posts
```
Database: main
Collection ID: blog_posts
Attributes:
- id (String, Required)
- title (String, Required)
- slug (String, Required, Unique)
- content (String, Required)
- excerpt (String)
- featured_image (String)
- author (String, Required)
- category (String)
- published (Boolean, Default: false)
- created_at (DateTime, Required)
- updated_at (DateTime, Required)
```

### Collection 5: Reviews
```
Database: main
Collection ID: reviews
Attributes:
- id (String, Required)
- product_id (String, Required)
- user_id (String, Required)
- rating (Integer, Required, Min: 1, Max: 5)
- comment (String)
- created_at (DateTime, Required)
```

### Collection 6: Users (Custom Data)
```
Database: main
Collection ID: users
Attributes:
- user_id (String, Required, Unique)
- name (String)
- email (String, Required, Unique)
- phone (String)
- addresses (JSON)
- preferences (JSON)
- created_at (DateTime, Required)
```

## Step 5: Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up for a business account
3. Complete KYC verification
4. Go to **Account Settings** → **API Keys**
5. Copy:
   - **Key ID** (public key)
   - **Key Secret** (secret key)

## Step 6: Set Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_SECRET=your_razorpay_secret_here
```

Replace the placeholders with your actual credentials.

## Step 7: Verify Setup

1. Run the development server: `npm run dev` (or `pnpm dev`)
2. Check the console for any Appwrite connection errors
3. Visit http://localhost:3000 to test the landing page

## Next Steps

- Create initial products and blog posts through Appwrite Console (or API)
- Test user registration and login
- Test product browsing and cart functionality
- Test payment flow with Razorpay test mode

## Security Notes

- Never commit `.env.local` to version control
- Keep your API keys secret
- Use Razorpay Test Mode for development
- Implement proper validation on both client and server
- Enable Row-Level Security (RLS) for collections as needed

## Troubleshooting

**"Connection refused" error:**
- Check your NEXT_PUBLIC_APPWRITE_ENDPOINT is correct
- Verify Appwrite is running (if self-hosted)

**"Permission denied" error:**
- Verify your API key has sufficient permissions
- Check Collection permissions in Appwrite Console

**Razorpay not working:**
- Ensure Key ID and Secret are correct
- Check that payment webhook is configured
- Test with Razorpay test credentials first

For more help, visit [Appwrite Documentation](https://appwrite.io/docs) or [Razorpay Documentation](https://razorpay.com/docs)
