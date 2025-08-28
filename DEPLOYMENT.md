# 🚀 OrderFlow Deployment Guide

## Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend Deployment (Vercel)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Vercel will automatically detect it's a Vite project
   - Deploy!

3. **Environment Variables in Vercel:**
   - Go to your project settings
   - Add environment variable: `VITE_API_URL=https://your-backend-domain.railway.app`

#### Backend Deployment (Railway)

1. **Push to GitHub:**
   ```bash
   cd server
   git add .
   git commit -m "Backend ready for deployment"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Create new project from GitHub repo
   - Select the `server` folder
   - Railway will auto-detect Node.js

3. **Environment Variables in Railway:**
   - Go to Variables tab
   - Add:
     - `ZR_TOKEN=your_zr_express_token`
     - `ZR_API_KEY=your_zr_express_api_key`
     - `FRONTEND_URL=https://your-frontend-domain.vercel.app`

### Option 2: Render (Alternative)

#### Frontend (Render Static Site)
- Go to [render.com](https://render.com)
- Create new Static Site
- Connect GitHub repo
- Build Command: `npm run build`
- Publish Directory: `dist`

#### Backend (Render Web Service)
- Go to [render.com](https://render.com)
- Create new Web Service
- Connect GitHub repo (server folder)
- Build Command: `npm install`
- Start Command: `node server-ultra-fixed.js`

### Option 3: DigitalOcean App Platform

1. **Frontend:**
   - Create new App
   - Source: GitHub repo
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Backend:**
   - Create new App
   - Source: GitHub repo (server folder)
   - Build Command: `npm install`
   - Run Command: `node server-ultra-fixed.js`

## Environment Variables Setup

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

### Backend (Railway/Render Variables)
```env
PORT=3001
ZR_TOKEN=your_zr_express_token_here
ZR_API_KEY=your_zr_express_api_key_here
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Webhook URLs for Production

After deployment, update your Storeep webhook URLs to:

**For Order Updates:**
```
https://your-backend-domain.railway.app/api/webhook/order-updated
```

**For New Orders:**
```
https://your-backend-domain.railway.app/api/webhook/order-created
```

## Testing Deployment

1. **Test Backend Health:**
   ```
   https://your-backend-domain.railway.app/api/health
   ```

2. **Test ZR Express Connection:**
   ```
   POST https://your-backend-domain.railway.app/api/zr-express/test
   ```

3. **Test Webhook:**
   ```
   POST https://your-backend-domain.railway.app/api/webhook/order-updated
   Content-Type: application/json
   
   {
     "id": "12345",
     "clientName": "Test Client",
     "phone": "0123456789",
     "address": "Alger, Algeria",
     "productName": "Test Product",
     "totalPrice": 1000
   }
   ```

## Cost Estimation

- **Vercel (Frontend):** Free tier available
- **Railway (Backend):** $5/month for basic plan
- **Render:** Free tier available
- **DigitalOcean:** $5/month per app

## Custom Domain Setup

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS:**
   - Frontend: CNAME to `your-app.vercel.app`
   - Backend: CNAME to `your-app.railway.app`
3. **Add custom domain in Vercel/Railway settings**

## Monitoring & Logs

- **Vercel:** Built-in analytics and logs
- **Railway:** Real-time logs in dashboard
- **Render:** Logs available in dashboard

## Backup & Recovery

1. **Database:** Consider adding MongoDB Atlas or PostgreSQL
2. **Files:** Use cloud storage (AWS S3, Cloudinary)
3. **Environment Variables:** Keep secure backups

## Security Checklist

- [ ] Environment variables set
- [ ] CORS configured properly
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Rate limiting (optional)
- [ ] Input validation
- [ ] Error handling

## Support

If you need help with deployment:
1. Check the platform's documentation
2. Review logs for errors
3. Test endpoints individually
4. Verify environment variables
