# CHIPS (Cookies Having Independent Partitioned State) Compliance

This document outlines the CHIPS compliance measures implemented in this project.

## Overview

CHIPS (Cookies Having Independent Partitioned State) is a web privacy standard that allows cookies to be partitioned by the top-level site, improving privacy while maintaining functionality. This project is configured to minimize unnecessary third-party cookie usage and support CHIPS compliance.

## Implementation

### 1. Server-Side Requests

- All Sanity API requests are made server-side, which doesn't send browser cookies
- Server-side requests to Sanity CDN don't transmit credentials unnecessarily
- Draft mode requests use tokens for authentication, avoiding cookie-based auth

### 2. Image Optimization

- Images from Sanity CDN are served through Next.js Image optimization
- Next.js Image component proxies images through our domain (`/_next/image`)
- This prevents direct browser requests to `cdn.sanity.io`, reducing third-party cookie exposure
- Always use the `Image` component from `next/image` for Sanity images

### 3. Headers Configuration

- `Permissions-Policy` headers are set to disable interest cohort tracking
- `Referrer-Policy` is configured for privacy
- Middleware ensures consistent header application

### 4. Third-Party Cookies

The project uses Sanity CMS, which may set cookies from:
- `cdn.sanity.io` - CDN for images and assets
- `*.sanity.io` - Sanity Studio authentication

**Note:** While we configure our application to minimize cookie usage, the actual cookie attributes (including `Partitioned`) are controlled by Sanity's servers. For full CHIPS compliance, Sanity's services should set cookies with the `Partitioned` attribute.

## Best Practices

1. **Always use Next.js Image component** for Sanity images
   ```tsx
   import Image from "next/image";
   // ✅ Good - uses Next.js optimization
   <Image src={imageUrl} alt="..." />
   
   // ❌ Bad - direct CDN link creates third-party request
   <img src="https://cdn.sanity.io/..." />
   ```

2. **Use server-side data fetching** - All Sanity queries should use `sanityFetch` which runs server-side

3. **Avoid client-side Sanity client** - Don't create Sanity clients in client components that might send cookies

## Testing

To verify CHIPS compliance:

1. Open Chrome DevTools → Application → Cookies
2. Check cookies from `cdn.sanity.io` and `*.sanity.io`
3. Verify cookies have `Partitioned` attribute (if set by Sanity)
4. Check Network tab → Issues panel for third-party cookie warnings

## References

- [CHIPS Specification](https://github.com/WICG/CHIPS)
- [Privacy Sandbox](https://privacysandbox.com/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

