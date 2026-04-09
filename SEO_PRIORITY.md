# SEO Priority Notes

This file is the standing implementation reference for future changes in this repo.

## Rule of thumb

When there is a tradeoff between a purely client-side UX improvement and crawlable, indexable, performant content, favor SEO first unless the user explicitly says otherwise.

## Implementation guardrails

1. Prefer Server Components, SSR, or SSG for indexable pages and primary page content.
2. Do not rely on client-side data fetching for content that should be discoverable by search engines.
3. Keep utility routes and auth-only routes `noindex`.
4. Add or preserve meaningful `metadata` for public pages:
   - title
   - description
   - robots
   - canonical when needed
   - open graph when relevant
5. Use semantic HTML with a clear heading hierarchy.
6. Keep primary content visible in the initial HTML whenever possible.
7. Use real links for crawlable navigation, not buttons with client-side redirects.
8. Avoid shipping large client bundles for above-the-fold content unless necessary.
9. Optimize media for performance:
   - descriptive `alt` text
   - avoid oversized images
   - protect LCP on landing and category pages
10. Avoid query-parameter-only experiences for important content pages.

## Route policy

- Public marketing, category, product, blog, and informational pages should usually be indexable.
- Cart, auth, password reset, account utilities, and other thin utility flows should usually be `noindex`.
- If a route has very little standalone content value, default to `noindex` unless there is a clear SEO reason not to.

## Current repo note

The current `/product` page is client-rendered and loads products via a client hook. This is a known SEO weakness compared with server-rendered product listing content.

## Pre-change checklist

Before implementing or approving changes, check:

- Will this make important content less crawlable?
- Will this move meaningful text or product data behind client-only rendering?
- Does this route need indexable metadata or `noindex` metadata?
- Does this change hurt performance on public landing pages?
- Are we preserving semantic content structure and internal linking?

## Default decision

If a future change is ambiguous, choose the SEO-safer implementation first and then layer interactivity on top.
