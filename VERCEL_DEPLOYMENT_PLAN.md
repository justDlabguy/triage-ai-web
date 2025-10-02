# Vercel Deployment Plan for Triage AI Web

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Create production environment variables
- [ ] Update API base URL for Render backend
- [ ] Configure CORS settings on backend
- [ ] Set up proper cookie domains

### 2. Missing Assets to Add
- [ ] App favicon (favicon.ico)
- [ ] App icons for PWA (192x192, 512x512)
- [ ] Logo files (SVG, PNG variants)
- [ ] Social media preview images
- [ ] Loading animations/illustrations

### 3. Performance Optimizations
- [ ] Configure Next.js for production
- [ ] Optimize bundle size
- [ ] Set up proper caching headers
- [ ] Enable compression

### 4. Backend Connectivity
- [ ] Update backend CORS origins
- [ ] Test API endpoints from Vercel domain
- [ ] Configure proper authentication flow

## Step-by-Step Deployment Process

### Phase 1: Environment Setup

1. **Create Vercel Environment Variables**
   ```bash
   # Production API URL (will be your Render backend URL)
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api/v1
   NEXT_PUBLIC_API_TIMEOUT=30000
   
   # Environment
   NODE_ENV=production
   
   # Optional: Analytics and monitoring
   NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

2. **Update Next.js Configuration**
   - Add production optimizations
   - Configure proper headers
   - Set up redirects if needed

### Phase 2: Asset Creation

1. **Required Assets**
   - App favicon: `public/favicon.ico`
   - App logo: `public/logo.svg`, `public/logo.png`
   - PWA icons: `public/icon-192.png`, `public/icon-512.png`
   - Social preview: `public/og-image.png`

2. **Optional Assets**
   - Loading illustrations
   - Error page graphics
   - Medical icons/illustrations

### Phase 3: Backend Integration

1. **Update Backend CORS Settings**
   - Add Vercel domain to allowed origins
   - Update render.yaml configuration
   - Redeploy backend to Render

2. **Test API Connectivity**
   - Verify authentication endpoints
   - Test triage analysis endpoints
   - Validate clinic search functionality

### Phase 4: Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings
   - Set environment variables

2. **Deploy and Test**
   - Deploy to preview environment
   - Test all functionality
   - Deploy to production

## Backend Render Deployment Updates Needed

### Update CORS Configuration
The backend needs to allow your Vercel domain in CORS origins:

```yaml
# In render.yaml
- key: CORS_ORIGINS
  value: '["https://your-app.vercel.app", "https://triage-ai-mobile.onrender.com"]'
```

### Expected Backend URL
Your backend will be deployed at: `https://triage-ai-backend.onrender.com`

## Post-Deployment Verification

### Functionality Tests
- [ ] User registration and login
- [ ] Triage form submission and analysis
- [ ] Clinic search and location services
- [ ] Profile management
- [ ] Demo mode functionality
- [ ] Error handling and loading states

### Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API response times < 2 seconds
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

## Monitoring and Maintenance

### Set Up Monitoring
- [ ] Vercel Analytics
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Regular Maintenance
- [ ] Monitor API usage and errors
- [ ] Update dependencies monthly
- [ ] Review performance metrics
- [ ] Test user flows regularly

## Estimated Timeline
- **Phase 1-2**: 2-3 hours (environment + assets)
- **Phase 3**: 1-2 hours (backend updates)
- **Phase 4**: 1 hour (deployment)
- **Testing**: 2-3 hours (comprehensive testing)

**Total**: 6-9 hours for complete deployment and testing