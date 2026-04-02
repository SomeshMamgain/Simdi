# Project Checklist

## Setup
- [x] Set up Next.js project with Tailwind CSS and TypeScript (existing repository confirmed)
- [x] Set up Appwrite client in `/lib/appwrite.ts`

## Static data
- [x] Create `/data/products.json` with sample products and required fields
- [x] Create `/data/blogs.json` with sample blogs and required fields
- [x] Create `/lib/getProducts.ts` helper
- [x] Create `/lib/getBlogs.ts` helper

## UI Components
- [x] Create `components/ProductCard.tsx`
- [x] Create `components/BlogCard.tsx`
- [x] Create `components/OrderCard.tsx`

## Dynamic pages
- [x] Create `/app/products/page.tsx` (product listing from JSON)
- [x] Create `/app/products/[slug]/page.tsx` (product details)
- [x] Create `/app/blogs/page.tsx` (blog listing from JSON)
- [x] Create `/app/blogs/[slug]/page.tsx` (blog details)
- [x] Add `/app/blog` + `/app/blog/[slug]` redirects to `/blogs`/`/blogs/[slug]`

## Appwrite Orders
- [ ] Create Appwrite orders collection with fields: `userId`, `items` (JSON string), `total`, `status`, `placedAt`

## New Commerce Features
- [x] Shop page created at `/shop` with tile-based product grid
- [x] Product tiles show first image, name, price, description
- [x] Clicking tile image or name navigates to `/products/[slug]`
- [x] Product detail page created with image gallery, ingredients, nutrition, recipes, reviews
- [x] Add to Cart button works on both shop page and product detail page
- [x] Remove from Cart button appears on product detail page when item is in cart
- [x] Cart state set up with Zustand and persisted to localStorage
- [x] Cart icon in Navbar shows item count badge
- [x] Cart drawer/sidebar works on mobile and desktop
- [x] Quantity increase/decrease works in cart drawer
- [x] Out of stock products disable Add to Cart

## Product detail SSG + UI requirements (completed)
- [x] `/app/products/[slug]/page.tsx` created with `generateStaticParams`
- [x] All products from `products.json` generate static pages at build time
- [x] `404` handled with `notFound()` for unknown slugs
- [x] Image gallery with thumbnail switching works
- [x] Breadcrumb navigation works
- [x] Star rating calculated from reviews average
- [x] Price shown with fake original price and discount badge
- [x] Add to Cart button connected to cart store with live count
- [x] Key Highlights section displayed
- [x] Delivery info box displayed
- [x] Ingredients shown as tags
- [x] Nutritional info shown as table
- [x] Recipes shown with steps
- [x] Customer reviews shown as cards
- [x] Page is fully responsive (mobile single column, desktop two column)

## Convention reminder
- [x] Use JSON files (not DB) for product/blog content
- [x] Use Appwrite only for auth/order history
- [x] Generate dynamic pages with `generateStaticParams`
- [x] Keep checklist updated
